import { Project, ts as tsm } from 'ts-morph'
import ts from 'typescript'
function getAncestor(node: ts.Node, kind: ts.SyntaxKind) {
	let search = node
	while(search && search.kind !== kind)search = search.parent
	return search
}
function findByType(node: ts.Node, kind: ts.SyntaxKind) {
	let match: ts.Node[] = []
	node.forEachChild( child => {
		if(child.kind === kind) {
			match.push(child)
		} else {
			match = [...match, ...findByType(child, kind)]
		}
	})
	if(node.kind === kind) match.push(node)
	return match
}
export default function (/*opts?: Opts*/) {
	return (ctx: ts.TransformationContext): ts.Transformer<any> => {
		return (sourceFile: ts.SourceFile) => {
			const project = new Project({})
			const source = project.addSourceFileAtPath(sourceFile.fileName)
			const decoratedParameters = source
				.getDescendantsOfKind(tsm.SyntaxKind.Parameter)
				.filter((param) => param.getDecorators().length > 0)
			const classes = {}
			for (const parameter of decoratedParameters) {
				const classy = parameter
					.getFirstAncestorByKind(ts.SyntaxKind.ClassDeclaration)
					.getName()
				const method = parameter
					.getFirstAncestorByKind(ts.SyntaxKind.MethodDeclaration)
					.getName()
				classes[classy] = classes[classy] || {}
				classes[classy][method] = classes[classy][method] || []
				const type = (
					parameter.getText().split(':')[1] ||
					parameter.getType().getApparentType().getText()
				).trim()

				classes[classy][method].push({
					property: parameter.getName(),
					kind: type,
					optional: parameter.isOptional(),
					defaults: parameter.hasInitializer()
						? parameter.getInitializer().getText()
						: undefined,
					rest: parameter.isRestParameter(),
				})
			}
			function DecorateMethod(
				classy: string,
				method: string,
				params: unknown[]
			) {
				return ctx.factory.createExpressionStatement(
					ctx.factory.createCallExpression(
						ctx.factory.createIdentifier('__decorate'),
						undefined,
						[
							ctx.factory.createArrayLiteralExpression(
								[
									ctx.factory.createCallExpression(
										ctx.factory.createIdentifier(
											'__metadata'
										),
										undefined,
										[
											ctx.factory.createStringLiteral(
												'mce:data'
											),
											ctx.factory.createIdentifier(
												JSON.stringify(params)
											),
										]
									),
								],
								true
							),
							ctx.factory.createIdentifier(`${classy}.prototype`),
							ctx.factory.createStringLiteral(method),
							ctx.factory.createNull(),
						]
					)
				)
			}

			const statements = [...sourceFile.statements]
			for (const cs of Object.keys(classes)) {
				const index = statements.findIndex( st => {
					const foundHere = [...findByType(st, ts.SyntaxKind.ClassExpression), ...findByType(st, ts.SyntaxKind.ClassDeclaration)]
					return foundHere.find((st) => st.name.text === cs)
				})
				for (const method of Object.keys(classes[cs])) {
					console.log(`insert ${cs} at ${index+1}`)
					statements.splice(
						index + 1,
						0,
						DecorateMethod(cs, method, classes[cs][method])
					)
				}
			}
			// console.log('ended')
			return ctx.factory.updateSourceFile(sourceFile, [...statements])
		}
	}
}
