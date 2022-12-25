/* eslint-disable no-fallthrough */
/* eslint-disable unicorn/no-useless-switch-case */
import { MarkdownElement } from './MarkdownIntrinsicElements';

const isValidNode = (value: unknown): value is MarkdownElement => {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	if (!('type' in value)) {
		return false;
	}

	return true;
};

export const getChildren = (properties: Record<string, unknown>): MarkdownElement[] => {
	const children: MarkdownElement[] = [];

	if (
		'children' in properties &&
		typeof properties.children === 'object' &&
		properties.children !== null &&
		Array.isArray(properties.children)
	) {
		const normalizedChildren = properties.children.flat(Number.POSITIVE_INFINITY);
		for (const child of normalizedChildren) {
			switch (typeof child) {
				case 'boolean':
				case 'undefined':
					// Just ignore booleans and undefined
					break;
				case 'string':
				case 'number':
					children.push({
						type: 'text',
						value: child.toString(),
					});
					break;
				case 'object':
					// Ignore nulls
					if (child === null) {
						break;
					}

					// If child is valid node, add it to array
					if (isValidNode(child)) {
						children.push(child);
						break;
					}

				// Otherwise, log error
				case 'bigint':
				case 'function':
				case 'symbol':
				default:
					throw new Error(`Objects of type ${typeof child} are not valid markdown elements.`);
			}
		}
	}

	return children;
};
