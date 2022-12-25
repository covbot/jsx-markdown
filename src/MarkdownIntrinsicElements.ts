import { Root, Paragraph, ThematicBreak, Blockquote, Heading, List, Content } from 'mdast';

export type MarkdownElement = Content | Root;

export type MarkdownNode = MarkdownElement | string | boolean | number | undefined | null;

export type PropertiesWithChildren<TProperties> = TProperties & {
	children?: MarkdownNode | MarkdownNode[];
};

type OmittedKeys = 'type' | 'children' | 'position';

type JSXAttributes<TAttributes> = TAttributes extends Record<'children', unknown>
	? PropertiesWithChildren<Omit<TAttributes, OmittedKeys>>
	: Omit<TAttributes, OmittedKeys>;

export interface MarkdownRootAttributes extends JSXAttributes<Root> {}
export interface MarkdownParagraphAttributes extends JSXAttributes<Paragraph> {}
export interface MarkdownThematicBreakAttributes extends JSXAttributes<ThematicBreak> {}
export interface MarkdownBlockquoteAttributes extends JSXAttributes<Blockquote> {}
export interface MarkdownHeadingAttributes extends JSXAttributes<Omit<Heading, 'depth'>> {}
export interface MarkdownListAttributes extends JSXAttributes<Omit<List, 'ordered'>> {}

export interface MarkdownIntrinsicElements {
	root: MarkdownRootAttributes;
	p: MarkdownParagraphAttributes;
	hr: MarkdownThematicBreakAttributes;
	blockquote: MarkdownBlockquoteAttributes;
	h1: MarkdownHeadingAttributes;
	h2: MarkdownHeadingAttributes;
	h3: MarkdownHeadingAttributes;
	h4: MarkdownHeadingAttributes;
	h5: MarkdownHeadingAttributes;
	h6: MarkdownHeadingAttributes;
	ul: MarkdownListAttributes;
	ol: MarkdownListAttributes;
}

export type MarkdownElementType = keyof MarkdownIntrinsicElements;

export type JSXElementConstructor<TProperties extends Record<string, unknown> = Record<string, unknown>> = (
	properties: TProperties,
) => MarkdownElement | null;

export type MarkdownAttributes<T extends MarkdownElementType | JSXElementConstructor> = T extends MarkdownElementType
	? MarkdownIntrinsicElements[MarkdownElementType]
	: T extends JSXElementConstructor<infer TProperties>
	? TProperties
	: never;
