import { MarkdownElement, MarkdownIntrinsicElements } from './MarkdownIntrinsicElements.js';

declare global {
	namespace JSX {
		interface Element extends MarkdownElement {}

		interface IntrinsicElements extends MarkdownIntrinsicElements {}
	}
}
