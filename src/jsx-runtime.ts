import {
	JSXElementConstructor,
	MarkdownAttributes,
	MarkdownElement,
	MarkdownElementType,
} from './MarkdownIntrinsicElements.js';
import './jsx-types.js';

export function jsx<T extends MarkdownElementType | JSXElementConstructor>(
	type: T,
	props: MarkdownAttributes<T>,
): MarkdownElement<MarkdownAttributes<T>, T> {
	if ('children' in props) {
		props.children = [props.children];
	}

	return jsxs(type, props);
}

const propFilter = (value: unknown) => value !== null && value !== undefined && value !== false;

export function jsxs<T extends MarkdownElementType | JSXElementConstructor>(
	type: T,
	props: MarkdownAttributes<T>,
): MarkdownElement<MarkdownAttributes<T>, T> {
	if ('children' in props && Array.isArray(props.children)) {
		props.children = props.children.filter(propFilter).flat();
	}

	return {
		type,
		props,
	};
}
