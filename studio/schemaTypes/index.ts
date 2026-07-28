import { objectTypes } from './objects'
import { blockTypes } from './blocks'
import { documentTypes } from './documents'

export const schemaTypes = [...objectTypes, ...blockTypes, ...documentTypes]
