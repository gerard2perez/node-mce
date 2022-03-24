/*
Copyright (C) 2022 Gerardo Pérez Pérez - All Rights Reserved
<gerard2perez@outlook.com>
Unauthorized copying of this file, via any medium is strictly prohibited 
Proprietary and confidential

File: global-teardown.ts
Created:  2022-03-24T20:14:53.633Z
Modified: 2022-03-24T20:23:53.260Z
*/

import { input, output } from '../../src/test/mce'

output.destroy()
input.destroy()