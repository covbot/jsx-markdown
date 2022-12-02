import {
	Blockquote as MarkdownBlockquote,
	Heading as MarkdownHeading,
	Paragraph as MarkdownParagraph,
	Root as MarkdownRoot,
	ThematicBreak as MarkdownThematicBreak,
} from 'mdast';

export type MarkdownIntrinsicElements = {
	root: Omit<MarkdownRoot, 'type'>;
	p: Omit<MarkdownParagraph, 'type'>;
	hr: Omit<MarkdownThematicBreak, 'type'>;
	blockquote: Omit<MarkdownBlockquote, 'type'>;
} & HeadingElements;

export type HeadingDepths = MarkdownHeading['depth'];

export type HeadingTypes = `h${HeadingDepths}`;

export type HeadingElements = Record<HeadingTypes, Omit<MarkdownHeading, 'depth' | 'type'>>;
