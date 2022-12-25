import { MarkdownElement, MarkdownIntrinsicElements } from './MarkdownIntrinsicElements';

export declare namespace JSX {
	type Element<T> = MarkdownElement;

	interface ElementChildrenAttribute {
		children: {}
	}

	interface IntrinsicElements extends MarkdownIntrinsicElements {}
}