
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname } from 'path'
import { inspect } from 'util'
import { writeJSON } from './fs'
import { makeChainable } from './wrappers'
/**
 * is an object with a "name" field and optionally "url" and "email"
 * Or you can shorten that all into a single string, and npm will parse it for you:
 * ```
 * "Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)"
 * ```
 */
type People = string | {
    name: string
    email?: string
    url?: string
}
type Funding = {
    type: string
    url: string
}
type SPDX_LICENSE = '0BSD'|'AAL'|'Abstyles'|'Adobe-2006'|'Adobe-Glyph'|'ADSL'|'AFL-1.1'|'AFL-1.2'|'AFL-2.0'|'AFL-2.1'|'AFL-3.0'|'Afmparse'|'AGPL-1.0-only'|'AGPL-1.0-or-later'|'AGPL-3.0-only'|'AGPL-3.0-or-later'|'Aladdin'|'AMDPLPA'|'AML'|'AMPAS'|'ANTLR-PD'|'ANTLR-PD-fallback'|'Apache-1.0'|'Apache-1.1'|'Apache-2.0'|'APAFML'|'APL-1.0'|'APSL-1.0'|'APSL-1.1'|'APSL-1.2'|'APSL-2.0'|'Artistic-1.0'|'Artistic-1.0-cl8'|'Artistic-1.0-Perl'|'Artistic-2.0'|'Bahyph'|'Barr'|'Beerware'|'BitTorrent-1.0'|'BitTorrent-1.1'|'blessing'|'BlueOak-1.0.0'|'Borceux'|'BSD-1-Clause'|'BSD-2-Clause'|'BSD-2-Clause-Patent'|'BSD-2-Clause-Views'|'BSD-3-Clause'|'BSD-3-Clause-Attribution'|'BSD-3-Clause-Clear'|'BSD-3-Clause-LBNL'|'BSD-3-Clause-No-Nuclear-License'|'BSD-3-Clause-No-Nuclear-License-2014'|'BSD-3-Clause-No-Nuclear-Warranty'|'BSD-3-Clause-Open-MPI'|'BSD-4-Clause'|'BSD-4-Clause-UC'|'BSD-Protection'|'BSD-Source-Code'|'BSL-1.0'|'BUSL-1.1'|'bzip2-1.0.5'|'bzip2-1.0.6'|'CAL-1.0'|'CAL-1.0-Combined-Work-Exception'|'Caldera'|'CATOSL-1.1'|'CC-BY-1.0'|'CC-BY-2.0'|'CC-BY-2.5'|'CC-BY-3.0'|'CC-BY-3.0-AT'|'CC-BY-3.0-US'|'CC-BY-4.0'|'CC-BY-NC-1.0'|'CC-BY-NC-2.0'|'CC-BY-NC-2.5'|'CC-BY-NC-3.0'|'CC-BY-NC-4.0'|'CC-BY-NC-ND-1.0'|'CC-BY-NC-ND-2.0'|'CC-BY-NC-ND-2.5'|'CC-BY-NC-ND-3.0'|'CC-BY-NC-ND-3.0-IGO'|'CC-BY-NC-ND-4.0'|'CC-BY-NC-SA-1.0'|'CC-BY-NC-SA-2.0'|'CC-BY-NC-SA-2.5'|'CC-BY-NC-SA-3.0'|'CC-BY-NC-SA-4.0'|'CC-BY-ND-1.0'|'CC-BY-ND-2.0'|'CC-BY-ND-2.5'|'CC-BY-ND-3.0'|'CC-BY-ND-4.0'|'CC-BY-SA-1.0'|'CC-BY-SA-2.0'|'CC-BY-SA-2.0-UK'|'CC-BY-SA-2.5'|'CC-BY-SA-3.0'|'CC-BY-SA-3.0-AT'|'CC-BY-SA-4.0'|'CC-PDDC'|'CC0-1.0'|'CDDL-1.0'|'CDDL-1.1'|'CDLA-Permissive-1.0'|'CDLA-Sharing-1.0'|'CECILL-1.0'|'CECILL-1.1'|'CECILL-2.0'|'CECILL-2.1'|'CECILL-B'|'CECILL-C'|'CERN-OHL-1.1'|'CERN-OHL-1.2'|'CERN-OHL-P-2.0'|'CERN-OHL-S-2.0'|'CERN-OHL-W-2.0'|'ClArtistic'|'CNRI-Jython'|'CNRI-Python'|'CNRI-Python-GPL-Compatible'|'Condor-1.1'|'copyleft-next-0.3.0'|'copyleft-next-0.3.1'|'CPAL-1.0'|'CPL-1.0'|'CPOL-1.02'|'Crossword'|'CrystalStacker'|'CUA-OPL-1.0'|'Cube'|'curl'|'D-FSL-1.0'|'diffmark'|'DOC'|'Dotseqn'|'DSDP'|'dvipdfm'|'ECL-1.0'|'ECL-2.0'|'EFL-1.0'|'EFL-2.0'|'eGenix'|'Entessa'|'EPICS'|'EPL-1.0'|'EPL-2.0'|'ErlPL-1.1'|'etalab-2.0'|'EUDatagrid'|'EUPL-1.0'|'EUPL-1.1'|'EUPL-1.2'|'Eurosym'|'Fair'|'Frameworx-1.0'|'FreeImage'|'FSFAP'|'FSFUL'|'FSFULLR'|'FTL'|'GFDL-1.1-invariants-only'|'GFDL-1.1-invariants-or-later'|'GFDL-1.1-no-invariants-only'|'GFDL-1.1-no-invariants-or-later'|'GFDL-1.1-only'|'GFDL-1.1-or-later'|'GFDL-1.2-invariants-only'|'GFDL-1.2-invariants-or-later'|'GFDL-1.2-no-invariants-only'|'GFDL-1.2-no-invariants-or-later'|'GFDL-1.2-only'|'GFDL-1.2-or-later'|'GFDL-1.3-invariants-only'|'GFDL-1.3-invariants-or-later'|'GFDL-1.3-no-invariants-only'|'GFDL-1.3-no-invariants-or-later'|'GFDL-1.3-only'|'GFDL-1.3-or-later'|'Giftware'|'GL2PS'|'Glide'|'Glulxe'|'GLWTPL'|'gnuplot'|'GPL-1.0-only'|'GPL-1.0-or-later'|'GPL-2.0-only'|'GPL-2.0-or-later'|'GPL-3.0-only'|'GPL-3.0-or-later'|'gSOAP-1.3b'|'HaskellReport'|'Hippocratic-2.1'|'HPND'|'HPND-sell-variant'|'HTMLTIDY'|'IBM-pibs'|'ICU'|'IJG'|'ImageMagick'|'iMatix'|'Imlib2'|'Info-ZIP'|'Intel'|'Intel-ACPI'|'Interbase-1.0'|'IPA'|'IPL-1.0'|'ISC'|'JasPer-2.0'|'JPNIC'|'JSON'|'LAL-1.2'|'LAL-1.3'|'Latex2e'|'Leptonica'|'LGPL-2.0-only'|'LGPL-2.0-or-later'|'LGPL-2.1-only'|'LGPL-2.1-or-later'|'LGPL-3.0-only'|'LGPL-3.0-or-later'|'LGPLLR'|'Libpng'|'libpng-2.0'|'libselinux-1.0'|'libtiff'|'LiLiQ-P-1.1'|'LiLiQ-R-1.1'|'LiLiQ-Rplus-1.1'|'Linux-OpenIB'|'LPL-1.0'|'LPL-1.02'|'LPPL-1.0'|'LPPL-1.1'|'LPPL-1.2'|'LPPL-1.3a'|'LPPL-1.3c'|'MakeIndex'|'MirOS'|'MIT'|'MIT-0'|'MIT-advertising'|'MIT-CMU'|'MIT-enna'|'MIT-feh'|'MIT-open-group'|'MITNFA'|'Motosoto'|'mpich2'|'MPL-1.0'|'MPL-1.1'|'MPL-2.0'|'MPL-2.0-no-copyleft-exception'|'MS-PL'|'MS-RL'|'MTLL'|'MulanPSL-1.0'|'MulanPSL-2.0'|'Multics'|'Mup'|'NASA-1.3'|'Naumen'|'NBPL-1.0'|'NCGL-UK-2.0'|'NCSA'|'Net-SNMP'|'NetCDF'|'Newsletr'|'NGPL'|'NIST-PD'|'NIST-PD-fallback'|'NLOD-1.0'|'NLPL'|'Nokia'|'NOSL'|'Noweb'|'NPL-1.0'|'NPL-1.1'|'NPOSL-3.0'|'NRL'|'NTP'|'NTP-0'|'O-UDA-1.0'|'OCCT-PL'|'OCLC-2.0'|'ODbL-1.0'|'ODC-By-1.0'|'OFL-1.0'|'OFL-1.0-no-RFN'|'OFL-1.0-RFN'|'OFL-1.1'|'OFL-1.1-no-RFN'|'OFL-1.1-RFN'|'OGC-1.0'|'OGL-Canada-2.0'|'OGL-UK-1.0'|'OGL-UK-2.0'|'OGL-UK-3.0'|'OGTSL'|'OLDAP-1.1'|'OLDAP-1.2'|'OLDAP-1.3'|'OLDAP-1.4'|'OLDAP-2.0'|'OLDAP-2.0.1'|'OLDAP-2.1'|'OLDAP-2.2'|'OLDAP-2.2.1'|'OLDAP-2.2.2'|'OLDAP-2.3'|'OLDAP-2.4'|'OLDAP-2.5'|'OLDAP-2.6'|'OLDAP-2.7'|'OLDAP-2.8'|'OML'|'OpenSSL'|'OPL-1.0'|'OSET-PL-2.1'|'OSL-1.0'|'OSL-1.1'|'OSL-2.0'|'OSL-2.1'|'OSL-3.0'|'Parity-6.0.0'|'Parity-7.0.0'|'PDDL-1.0'|'PHP-3.0'|'PHP-3.01'|'Plexus'|'PolyForm-Noncommercial-1.0.0'|'PolyForm-Small-Business-1.0.0'|'PostgreSQL'|'PSF-2.0'|'psfrag'|'psutils'|'Python-2.0'|'Qhull'|'QPL-1.0'|'Rdisc'|'RHeCos-1.1'|'RPL-1.1'|'RPL-1.5'|'RPSL-1.0'|'RSA-MD'|'RSCPL'|'Ruby'|'SAX-PD'|'Saxpath'|'SCEA'|'Sendmail'|'Sendmail-8.23'|'SGI-B-1.0'|'SGI-B-1.1'|'SGI-B-2.0'|'SHL-0.5'|'SHL-0.51'|'SimPL-2.0'|'SISSL'|'SISSL-1.2'|'Sleepycat'|'SMLNJ'|'SMPPL'|'SNIA'|'Spencer-86'|'Spencer-94'|'Spencer-99'|'SPL-1.0'|'SSH-OpenSSH'|'SSH-short'|'SSPL-1.0'|'SugarCRM-1.1.3'|'SWL'|'TAPR-OHL-1.0'|'TCL'|'TCP-wrappers'|'TMate'|'TORQUE-1.1'|'TOSL'|'TU-Berlin-1.0'|'TU-Berlin-2.0'|'UCL-1.0'|'Unicode-DFS-2015'|'Unicode-DFS-2016'|'Unicode-TOU'|'Unlicense'|'UPL-1.0'|'Vim'|'VOSTROM'|'VSL-1.0'|'W3C'|'W3C-19980720'|'W3C-20150513'|'Watcom-1.0'|'Wsuipa'|'WTFPL'|'X11'|'Xerox'|'XFree86-1.1'|'xinetd'|'Xnet'|'xpp'|'XSkat'|'YPL-1.0'|'YPL-1.1'|'Zed'|'Zend-2.0'|'Zimbra-1.3'|'Zimbra-1.4'|'Zlib'|'zlib-acknowledgement'|'ZPL-1.1'|'ZPL-2.0'|'ZPL-2.1'
type Repository = string | {
    type: string
    url: string
    directory?: string
}
export class PackageJSON {
    /**
     * If you plan to publish your package, the most important things in your package.json are the name and version fields as they will be required. The name and version together form an identifier that is assumed to be completely unique. Changes to the package should come along with changes to the version. If you don't plan to publish your package, the name and version fields are optional.

        The name is what your thing is called.

        Some rules:

        1. The name must be less than or equal to 214 characters. This includes the scope for scoped packages.
        1. The names of scoped packages can begin with a dot or an underscore. This is not permitted without a scope.
        1. New packages must not have uppercase letters in the name.
        1. The name ends up being part of a URL, an argument on the command line, and a folder name. Therefore, the name can't contain any non-URL-safe characters.

        Some tips:

        1. Don't use the same name as a core Node module.
        1. Don't put "js" or "node" in the name. It's assumed that it's js, since you're writing a package.json file, and you can specify the engine using the "engines" field. (See below.)
        1. The name will probably be passed as an argument to require(), so it should be something short, but also reasonably descriptive.
        1. You may want to check the npm registry to see if there's something by that name already, before you get too attached to it. https://www.npmjs.com/

        A name can be optionally prefixed by a scope, e.g. @myorg/mypackage. See scope for more detail.
     */
    name!: string
    /**
     * If you plan to publish your package, the most important things in your package.json are the name and version fields as they will be required. The name and version together form an identifier that is assumed to be completely unique. Changes to the package should come along with changes to the version. If you don't plan to publish your package, the name and version fields are optional.

        Version must be parseable by node-semver, which is bundled with npm as a dependency. (npm install semver to use it yourself.)

        More on version numbers and ranges at semver.
     */
    version!: string
    /**
     * Put a description in it. It's a string. This helps people discover your package, as it's listed in npm search.
     */
    description?: string
    /**
     * Put keywords in it. It's an array of strings. This helps people discover your package as it's listed in npm search.
     */
    keywords?: string[]
    /**
     * The url to the project homepage.
     */
    homepage?: string
    /**
     * The url to your project's issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package.
     */
    bugs?: {
        url: string
        email: string
    } | string
    license: (SPDX_LICENSE | 'UNLICENSED')
    private?: boolean
    /**
     * is an object with a "name" field and optionally "url" and "email"
     * Or you can shorten that all into a single string, and npm will parse it for you:
     * ```
     * "Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)"
     * ```
     */
    author!: string | {
        name: string
        email?: string
        url?: string
    }
    /**
     * is an object with a "name" field and optionally "url" and "email"
     * Or you can shorten that all into a single string, and npm will parse it for you:
     * ```
     * "Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)"
     * ```
     */
    contributors?: People[]
    /**
     * You can specify an object containing an URL that provides up-to-date information about ways to help fund development of your package, or a string
     */
    funding?: string | Funding | (Funding|string)[]
    /**
     * The optional files field is an array of file patterns that describes the entries to be included when your package is installed as a dependency.
     *
     * File patterns follow a similar syntax to .gitignore, but reversed: including a file, directory, or glob pattern ( *, **\/*, and such\) will make it so that file is included in the tarball when it's packed. Omitting the field will make it default to ["*"], which means it will include all files.

        Some special files and directories are also included or excluded regardless of whether they exist in the files array (see below).

        You can also provide a .npmignore file in the root of your package or in subdirectories, which will keep files from being included. At the root of your package it will not override the "files" field, but in subdirectories it will. The .npmignore file works just like a .gitignore. If there is a .gitignore file, and .npmignore is missing, .gitignore's contents will be used instead.

        Files included with the "package.json#files" field cannot be excluded through .npmignore or .gitignore.

        Certain files are always included, regardless of settings:

        - package.json
        - README
        - CHANGES / CHANGELOG / HISTORY
        - LICENSE / LICENCE
        - NOTICE
        - The file in the "main" field
        README, CHANGES, LICENSE & NOTICE can have any case and extension.

        Conversely, some files are always ignored:

        - .git
        - CVS
        - .svn
        - .hg
        - .lock-wscript
        - .wafpickle-N
        - .DS_Store
        - npm-debug.log
        - .npmrc
        - node_modules
        - config.gypi
        - package-lock.json (use shrinkwrap instead)
        - All files containing a * character (incompatible with Windows)
     */
    files?: string[]
    /**
     * The main field is a module ID that is the primary entry point to your program. That is, if your package is named foo, and a user installs it, and then does require("foo"), then your main module's exports object will be returned.
     *
     * This should be a module ID relative to the root of your package folder.
     *
     * For most modules, it makes the most sense to have a main script and often not much else.
     */
    main!: string
    /**
     * If your module is meant to be used client-side the browser field should be used instead of the main field. This is helpful to hint users that it might rely on primitives that aren't available in Node.js modules. (e.g. window)
     */
    browser?: string
    /**
        A lot of packages have one or more executable files that they'd like to install into the PATH. npm makes this pretty easy (in fact, it uses this feature to install the "npm" executable.)

        To use this, supply a bin field in your package.json which is a map of command name to local file name. On install, npm will symlink that file into prefix/bin for global installs, or ./node_modules/.bin/ for local installs.

        For example, myapp could have this:

        ```
        { "bin" : { "myapp" : "./cli.js" } }
        ```
        So, when you install myapp, it'll create a symlink from the cli.js script to /usr/local/bin/myapp.

        If you have a single executable, and its name should be the name of the package, then you can just supply it as a string. For example:

        ```
        {
            "name": "my-program",
            "version": "1.2.5",
            "bin": "./path/to/program"
        }
        ```
        would be the same as this:
        ```
        {
            "name": "my-program",
            "version": "1.2.5",
            "bin" : { "my-program" : "./path/to/program" }
        }
        ```
        Please make sure that your file(s) referenced in bin starts with #!/usr/bin/env node, otherwise the scripts are started without the node executable!
     */
    bin?: string | {[bin: string]: string}
    /**
        Specify either a single file or an array of filenames to put in place for the man program to find.

        If only a single file is provided, then it's installed such that it is the result from man <pkgname>, regardless of its actual filename. For example:
        ```
        { "name" : "foo"
        , "version" : "1.2.3"
        , "description" : "A packaged foo fooer for fooing foos"
        , "main" : "foo.js"
        , "man" : "./man/doc.1"
        }
        ```
        would link the ./man/doc.1 file in such that it is the target for man foo

        If the filename doesn't start with the package name, then it's prefixed. So, this:
        ```
        { "name" : "foo"
        , "version" : "1.2.3"
        , "description" : "A packaged foo fooer for fooing foos"
        , "main" : "foo.js"
        , "man" : [ "./man/foo.1", "./man/bar.1" ]
        }
        ```
        will create files to do man foo and man foo-bar.

        Man files must end with a number, and optionally a .gz suffix if they are compressed. The number dictates which man section the file is installed into.
        ```
        { "name" : "foo"
        , "version" : "1.2.3"
        , "description" : "A packaged foo fooer for fooing foos"
        , "main" : "foo.js"
        , "man" : [ "./man/foo.1", "./man/foo.2" ]
        }
        ```
        will create entries for man foo and man 2 foo
     */
    man?: string | string[]
    directories?: {
        /**
         * Tell people where the bulk of your library is. Nothing special is done with the lib folder in any way, but it's useful meta info.
         */
        lib?: string
        /**
         * If you specify a bin directory in directories.bin, all the files in that folder will be added.
         * Because of the way the bin directive works, specifying both a bin path and setting directories.bin is an error. If you want to specify individual files, use bin, and for all the files in an existing bin directory, use directories.bin.
         */
        bin?: string
        /**
         * A folder that is full of man pages. Sugar to generate a "man" array by walking the folder.
         */
        man?: string
        /**
         * Put markdown files in here. Eventually, these will be displayed nicely, maybe, someday.
         */
        doc?: string

        /**
         * Put example scripts in here. Someday, it might be exposed in some clever way.
         */
        example?: string

        /**
         * Put your tests in here. It is currently not exposed, but it might be in the future.
         */
        test?: string
    }
    /**
        Specify the place where your code lives. This is helpful for people who want to contribute. If the git repo is on GitHub, then the npm docs command will be able to find you.

        Do it like this:
        ```
        "repository": {
            "type" : "git",
            "url" : "https://github.com/npm/cli.git"
        }
        "repository": {
            "type" : "svn",
            "url" : "https://v8.googlecode.com/svn/trunk/"
        }
        ```
        The URL should be a publicly available (perhaps read-only) url that can be handed directly to a VCS program without any modification. It should not be a url to an html project page that you put in your browser. It's for computers.

        For GitHub, GitHub gist, Bitbucket, or GitLab repositories you can use the same shortcut syntax you use for npm install:
        ```
        "repository": "npm/npm"
        "repository": "github:user/repo"
        "repository": "gist:11081aaa281"
        "repository": "bitbucket:user/repo"
        "repository": "gitlab:user/repo"
        ```
        If the package.json for your package is not in the root directory (for example if it is part of a monorepo), you can specify the directory in which it lives:
        ```
        "repository": {
            "type" : "git",
            "url" : "https://github.com/facebook/react.git",
            "directory": "packages/react-dom"
        }
        ```
    */
    respository?: Repository
    /**
     * The "scripts" property is a dictionary containing script commands that are run at various times in the lifecycle of your package. The key is the lifecycle event, and the value is the command to run at that point.
     *
     * See [scripts](https://docs.npmjs.com/cli/v6/using-npm/scripts). to find out more about writing package scripts.
     */
    scripts?: {[name: string]: string}
    /**
     A "config" object can be used to set configuration parameters used in package scripts that persist across upgrades. For instance, if a package had the following:

    ```
    {
        "name" : "foo",
        "config" : { "port" : "8080" }
    }
    ```

    and then had a "start" command that then referenced the npm_package_config_port environment variable, then the user could override that by doing npm config set foo:port 8001.

    See [config](https://docs.npmjs.com/cli/v6/using-npm/config) and [scripts](https://docs.npmjs.com/cli/v6/using-npm/scripts) for more on package configs.
     */
    config?: {[key: string]: unknown}
    /**
    Dependencies are specified in a simple object that maps a package name to a version range. The version range is a string which has one or more space-separated descriptors. Dependencies can also be identified with a tarball or git URL.

    Please do not put test harnesses or transpilers in your dependencies object. See devDependencies, below.

    See semver for more details about specifying version ranges.

    - version Must match version exactly
    - >version Must be greater than version
    - >=version etc
    - <version
    - <=version
    - ~version "Approximately equivalent to version" See semver
    - ^version "Compatible with version" See semver
    - 1.2.x 1.2.0, 1.2.1, etc., but not 1.3.0
    - http://... See 'URLs as Dependencies' below
    - * Matches any version
    - "" (just an empty string) Same as *
    - version1 - version2 Same as >=version1 <=version2.
    - range1 || range2 Passes if either range1 or range2 are satisfied.
    - git... See 'Git URLs as Dependencies' below
    - user/repo See 'GitHub URLs' below
    - tag A specific version tagged and published as tag See npm dist-tag
    - path/path/path See Local Paths below

    For example, these are all valid:

    ```
    {
        "dependencies": {
            "foo" : "1.0.0 - 2.9999.9999",
            "bar" : ">=1.0.2 <2.1.2",
            "baz" : ">1.0.2 <=2.3.4",
            "boo" : "2.0.1",
            "qux" : "<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0",
            "asd" : "http://asdf.com/asdf.tar.gz",
            "til" : "~1.2",
            "elf" : "~1.2.3",
            "two" : "2.x",
            "thr" : "3.3.x",
            "lat" : "latest",
            "dyl" : "file:../dyl"
        }
    }
    ```
    URLs as Dependencies
    You may specify a tarball URL in place of a version range.

    This tarball will be downloaded and installed locally to your package at install time.

    Git URLs as Dependencies
    Git urls are of the form:

    ```
    <protocol>://[<user>[:<password>]@]<hostname>[:<port>][:][/]<path>[#<commit-ish> | #semver:<semver>]
    ```

    <protocol> is one of git, git+ssh, git+http, git+https, or git+file.

    If #<commit-ish> is provided, it will be used to clone exactly that commit. If the commit-ish has the format #semver:<semver>, <semver> can be any valid semver range or exact version, and npm will look for any tags or refs matching that range in the remote repository, much as it would for a registry dependency. If neither #<commit-ish> or #semver:<semver> is specified, then master is used.

    Examples:

    ```
    git+ssh://git@github.com:npm/cli.git#v1.0.27
    git+ssh://git@github.com:npm/cli#semver:^5.0
    git+https://isaacs@github.com/npm/cli.git
    git://github.com/npm/cli.git#v1.0.27
    ```

    GitHub URLs
    As of version 1.1.65, you can refer to GitHub urls as just "foo": "user/foo-project". Just as with git URLs, a commit-ish suffix can be included. For example:

    ```
    {
        "name": "foo",
        "version": "0.0.0",
        "dependencies": {
            "express": "expressjs/express",
            "mocha": "mochajs/mocha#4727d357ea",
            "module": "user/repo#feature\/branch"
        }
    }
    ```

    Local Paths
    As of version 2.0.0 you can provide a path to a local directory that contains a package. Local paths can be saved using npm install -S or npm install --save, using any of these forms:

    ```
    ../foo/bar
    ~/foo/bar
    ./foo/bar
    /foo/bar
    ```

    in which case they will be normalized to a relative path and added to your package.json. For example:

    ```
    {
        "name": "baz",
        "dependencies": {
            "bar": "file:../foo/bar"
        }
    }
    ```

    This feature is helpful for local offline development and creating tests that require npm installing where you don't want to hit an external server, but should not be used when publishing packages to the public registry.
     */
    dependencies?: { [pack_name: string]: string}
    devDependencies?: { [pack_name: string]: string}
    peerDependencies?: { [pack_name: string]: string}
    /**
        This defines an array of package names that will be bundled when publishing the package.

        In cases where you need to preserve npm packages locally or have them available through a single file download, you can bundle the packages in a tarball file by specifying the package names in the bundledDependencies array and executing npm pack.

        For example:

        If we define a package.json like this:

        ```
        {
            "name": "awesome-web-framework",
            "version": "1.0.0",
            "bundledDependencies": [
                "renderized", "super-streams"
            ]
        }
        ```
        we can obtain awesome-web-framework-1.0.0.tgz file by running npm pack. This file contains the dependencies renderized and super-streams which can be installed in a new project by executing npm install awesome-web-framework-1.0.0.tgz. Note that the package names do not include any versions, as that information is specified in dependencies.

        If this is spelled "bundleDependencies", then that is also honored.
     */
    bundledDependencies?: { [pack_name: string]: string}
    optionalDependencies?: { [pack_name: string]: string}
    /**
        You can specify the version of node that your stuff works on:

        ```
        { "engines" : { "node" : ">=0.10.3 <0.12" } }
        ```

        And, like with dependencies, if you don't specify the version (or if you specify "*" as the version), then any version of node will do.

        If you specify an "engines" field, then npm will require that "node" be somewhere on that list. If "engines" is omitted, then npm will just assume that it works on node.

        You can also use the "engines" field to specify which versions of npm are capable of properly installing your program. For example:

        ```
        { "engines" : { "npm" : "~1.0.20" } }
        ```

        Unless the user has set the engine-strict config flag, this field is advisory only and will only produce warnings when your package is installed as a dependency.
     */
    engines?: { [tool: string]: string }
    /**
        You can specify which operating systems your module will run on:

        ```
        "os" : [ "darwin", "linux" ]
        ```

        You can also blacklist instead of whitelist operating systems, just prepend the blacklisted os with a '!':

        ```
        "os" : [ "!win32" ]
        ```

        The host operating system is determined by process.platform

        It is allowed to both blacklist, and whitelist, although there isn't any good reason to do this.
     */
    os?: string[]
    /**
    If your code only runs on certain cpu architectures, you can specify which ones.

    ```
    "cpu" : [ "x64", "ia32" ]
    ```

    Like the os option, you can also blacklist architectures:

    ```
    "cpu" : [ "!arm", "!mips" ]
    ```

    The host architecture is determined by process.arch
    */
    cpu?: string[]
    publishConfig?: {[key: string]: unknown}
    workspaces?: string[]
    typings?: string
    readme?: string
    constructor(private location: string) {
        try {
        Object.assign(this, JSON.parse(readFileSync(location, { encoding: 'utf-8'})))
        } catch(ex) {
            return this
        }
    }
    [inspect.custom]() {
        return this.prepare()
    }
    private prepare() {
        let clone = JSON.parse(JSON.stringify(this)) as PackageJSON
        clone.contributors = []
        delete clone.location
        for(const key of Object.keys(clone)) {
            if(clone[key] instanceof Array && !clone[key].length) {
                delete clone[key]
            }
        }
        clone = clone || {} as any
        return clone
    }
    persist() {
        try {
            mkdirSync(dirname(this.location), {recursive: true})
        } catch (ex ) {
            console.error(ex)
         }
        writeFileSync(this.location, JSON.stringify(this.prepare(), null, 2)+'\n')
    }
    withDefaults(data: PackProperties) {
        Object.assign(this, data, this)
        return this
    }
    patchValues(data: PackProperties) {
        Object.assign(this, data)
        return this
    }
    save() {
        return makeChainable(writeJSON)('package.json', this.prepare())
    }
}
type Props<T=PackageJSON> = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [key in keyof T]: T[key] extends Function ? never : T[key]
}
export type PackProperties = Omit<Props, 'save'|'patchValues'|'withDefaults'|'persist'|'[ispect.custom]'|typeof inspect.custom>
