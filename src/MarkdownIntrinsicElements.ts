import { Root, Paragraph, ThematicBreak, Blockquote, Heading, List } from 'mdast';

type JSXAttributes<TAttributes> = Omit<TAttributes, 'type' | 'children' | 'position'>;

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

export type JSXElementConstructor<TProps extends Record<string, unknown> = Record<string, unknown>> = (
	props: TProps,
) => MarkdownElement<any, any> | null;

export type MarkdownElement<
	TProps = any,
	TType extends MarkdownElementType | JSXElementConstructor = MarkdownElementType | JSXElementConstructor,
> = {
	props: TProps;
	type: TType;
};

export type MarkdownNode = string | number | null | undefined | false | MarkdownElement | MarkdownElement[];

export type PropsWithChildren<TProps> = TProps & {
	children?: MarkdownNode;
};

export type MarkdownAttributes<T extends MarkdownElementType | JSXElementConstructor> = T extends MarkdownElementType
	? PropsWithChildren<MarkdownIntrinsicElements[MarkdownElementType]>
	: T extends JSXElementConstructor<infer TProps>
	? TProps
	: never;
