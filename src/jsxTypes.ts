import { MarkdownElement, MarkdownIntrinsicElements } from './MarkdownIntrinsicElements';

export declare namespace JSX {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type Element<T> = MarkdownElement;

	interface ElementChildrenAttribute {
		children: {};
	}

	interface IntrinsicElements extends MarkdownIntrinsicElements {}
}
