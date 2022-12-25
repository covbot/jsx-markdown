import { getChildren } from './getChildren';
import { jsxIntoMd } from './jsxIntoMd';
import {
	JSXElementConstructor,
	MarkdownAttributes,
	MarkdownElement,
	MarkdownElementType,
} from './MarkdownIntrinsicElements';

export * from './jsxTypes';

export function jsx<T extends MarkdownElementType | JSXElementConstructor>(
	type: T,
	properties: MarkdownAttributes<T>,
): MarkdownElement | null {
	if ('children' in properties) {
		properties.children = [properties.children];
	}

	return jsxs(type, properties);
}

export function jsxs<T extends MarkdownElementType | JSXElementConstructor>(
	type: T,
	properties: MarkdownAttributes<T>,
): MarkdownElement | null {
	const children = getChildren(properties);

	if (typeof type === 'function') {
		return type({ ...properties, children });
	}

	return jsxIntoMd(type, properties, children);
}
