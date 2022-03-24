import { ParameterDeclaration, Project, PropertyDeclaration, ts as tsm } from 'ts-morph'
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
function DecorateMethod(
	ctx: ts.TransformationContext,
	classy: string,
	method: string,
	data: unknown[]
) {
	
	const body = JSON.stringify(data)
	// ctx.factory.create
	// console.log(body.().getText())

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
								ctx.factory.createIdentifier(body)
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
function DecorateProperty(
	ctx: ts.TransformationContext,
	classy: string,
	propertyKey: string,
	data: any
) {
	const { parser, kind, isEnum, defaults, ...params }  = data
	const objBody = {...params, 'defaults': '_defaults', 'kind': '_kind'}
	if(!defaults) delete objBody.defaults
	let body = JSON.stringify(objBody)
	body = body.replace('"_defaults"', defaults)
	if(isEnum) {
		body = body.replace('"_kind"', kind)
	} else {
		body = body.replace('_kind', kind)
	}
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
								ctx.factory.createIdentifier(body),
							]
						),
					],
					true
				),
				ctx.factory.createIdentifier(`${classy}.prototype`),
				ctx.factory.createStringLiteral(propertyKey),
				ctx.factory.createVoidZero(),
			]
		)
	)
}
export default function (/*opts?: Opts*/) {
	return (ctx: ts.TransformationContext): ts.Transformer<any> => {
		return (sourceFile: ts.SourceFile) => {
			const project = new Project({})
			const source = project.addSourceFileAtPath(sourceFile.fileName)

			const hasExportedAction = source.getDescendantsOfKind(tsm.SyntaxKind.FunctionDeclaration).filter(fd => {
				return fd.getName() === 'action' && fd.isExported()
			})
			if(hasExportedAction.length) {
				ts.sys.write(`[MCE][WRN] This kind of module is deprecated, please migrate to class module. At ${sourceFile.fileName}\n\n`)
			}
			const decoratedParameters = source
				.getDescendantsOfKind(tsm.SyntaxKind.Parameter)
				.filter((param) => param.getDecorators().some(decorator => decorator.getName() === 'arg'))
			const parametersByClassAndMethod = FindAllArguments(decoratedParameters)

			const propertiesDecorated = source
				.getDescendantsOfKind(tsm.SyntaxKind.PropertyDeclaration)
				.filter(property => property.getDecorators().some(decorator => decorator.getName() === 'opt'))
			const propertiesByClass = FindAllProperties(propertiesDecorated)
			

			const statements = [...sourceFile.statements]
			for (const classNameKey of Object.keys(parametersByClassAndMethod)) {
				const index = statements.findIndex( st => {
					const foundHere = [...findByType(st, ts.SyntaxKind.ClassExpression), ...findByType(st, ts.SyntaxKind.ClassDeclaration)]
					return foundHere.find((st) => (st as any).name.text === classNameKey)
				})
				for (const method of Object.keys(parametersByClassAndMethod[classNameKey])) {
					statements.splice(
						index + 1,
						0,
						DecorateMethod(ctx, classNameKey, method, parametersByClassAndMethod[classNameKey][method])
					)
				}
			}
			for (const classNameKey of Object.keys(propertiesByClass)) {
				const index = statements.findIndex( st => {
					const foundHere = [...findByType(st, ts.SyntaxKind.ClassExpression), ...findByType(st, ts.SyntaxKind.ClassDeclaration)]
					return foundHere.find((st) => (st as any).name.text === classNameKey)
				})
				for(const propertyData of propertiesByClass[classNameKey]) {
					statements.splice(
						index + 1,
						0,
						DecorateProperty(ctx, classNameKey, propertyData.property, propertyData)
					)
				}
			}
			return ctx.factory.updateSourceFile(sourceFile, [...statements])
		}
	}
}
function FindAllArguments(decoratedParameters: ParameterDeclaration[]) {
	const classes = {}
	for (const parameter of decoratedParameters) {

		// Finds the class with has @arg
		const classy = parameter
			.getFirstAncestorByKind(ts.SyntaxKind.ClassDeclaration)
			.getName()
		classes[classy] = classes[classy] || {}


		//Find the method wich contains the @args
		const method = parameter
			.getFirstAncestorByKind(ts.SyntaxKind.MethodDeclaration)
			.getName()
		classes[classy][method] = classes[classy][method] || []

		//Gets the typoe as string
		const type = getFullType(parameter)

		//Fills the mce_data
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
	return classes
}
function FindAllProperties(propertiesDecorated: PropertyDeclaration[]) {
	const classes = {}
	for (const propertyDcl of propertiesDecorated) {

		// Finds the class with has @opt
		const classy = propertyDcl
			.getFirstAncestorByKind(ts.SyntaxKind.ClassDeclaration)
			.getName()
		classes[classy] = classes[classy] || []


		//Find the method wich contains the @args
		// const method = propertyDcl
		// 	.getFirstAncestorByKind(ts.SyntaxKind.MethodDeclaration)
		// 	.getName()
		// classes[classy][method] = classes[classy][method] || []

		//Gets the typoe as string
		const type = getFullType(propertyDcl)
		const isEnum = propertyDcl.getType().isEnum()
		//Fills the mce_data
		classes[classy].push({
			isEnum,
			property: propertyDcl.getName(),
			kind: type,
			parser: isEnum ? `str => ${type}[str]` : undefined,
			// optional: propertyDcl.isOptional(),
			defaults: propertyDcl.hasInitializer()
				? propertyDcl.getInitializer().getText()
				: undefined,
			// rest: propertyDcl.isRestParameter(),
		})
	}
	return classes
}

function getFullType(propertyDcl: PropertyDeclaration | ParameterDeclaration) {
	const apparentType = propertyDcl.getType().getApparentType()
	const type = (
		propertyDcl.getText().split(':')[1] ||
		apparentType.getText()
	).trim().split('=')[0].trim()

	return type
}

