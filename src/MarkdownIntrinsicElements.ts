import {
	Root,
	Paragraph,
	ThematicBreak,
	Blockquote,
	Heading,
	List,
	Content,
	Table,
	TableRow,
	TableCell,
	Code,
	InlineCode,
	Literal,
	Parent,
	Link,
	Resource,
} from 'mdast';

export type MarkdownElement = Content | Root;

export type MarkdownNode = MarkdownElement | string | boolean | number | undefined | null;

export type PropertiesWithChildren<TProperties> = TProperties & {
	children?: MarkdownNode | MarkdownNode[];
};

type IgnoredMdKeys = 'type' | 'children' | 'position';

type JSXAttributes<TAttributes> = TAttributes extends Parent
	? PropertiesWithChildren<Omit<TAttributes, IgnoredMdKeys>>
	: Omit<TAttributes, IgnoredMdKeys>;

type JSXLiteralAttributes<TAttributes extends Literal> = Omit<TAttributes, IgnoredMdKeys | 'value'> & {
	children: TAttributes['value'] | TAttributes['value'][];
};

type JSXLinkAttributes<TAttributes extends Resource> = JSXAttributes<Omit<TAttributes, 'url'>> & {
	href: TAttributes['url'];
};

export interface MarkdownRootAttributes extends JSXAttributes<Root> {}
export interface MarkdownParagraphAttributes extends JSXAttributes<Paragraph> {}
export interface MarkdownThematicBreakAttributes extends JSXAttributes<ThematicBreak> {}
export interface MarkdownBlockquoteAttributes extends JSXAttributes<Blockquote> {}
export interface MarkdownHeadingAttributes extends JSXAttributes<Omit<Heading, 'depth'>> {}
export interface MarkdownListAttributes extends JSXAttributes<Omit<List, 'ordered'>> {}
export interface MarkdownTableAttributes extends JSXAttributes<Table> {}
export interface MarkdownTableBodyAttributes extends JSXAttributes<{}> {}
export interface MarkdownTableHeadAttributes extends JSXAttributes<{}> {}
export interface MarkdownTableRowAttributes extends JSXAttributes<TableRow> {}
export interface MarkdownTableCellAttributes extends JSXAttributes<TableCell> {}
export interface MarkdownCodeAttributes extends JSXLiteralAttributes<Code> {}
export interface MarkdownInlineCodeAttributes extends JSXLiteralAttributes<InlineCode> {}
export interface MarkdownLinkAttributes extends JSXLinkAttributes<Link> {}

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
	table: MarkdownTableAttributes;
	tbody: MarkdownTableBodyAttributes;
	thead: MarkdownTableHeadAttributes;
	tr: MarkdownTableRowAttributes;
	th: MarkdownTableCellAttributes;
	td: MarkdownTableCellAttributes;
	pre: MarkdownCodeAttributes;
	code: MarkdownInlineCodeAttributes;
	a: MarkdownLinkAttributes;
}

export type MarkdownElementType = keyof MarkdownIntrinsicElements;

export type JSXElementConstructor<TProperties extends Record<string, unknown> = Record<string, unknown>> = (
	properties: TProperties,
) => MarkdownElement | null;

export type MarkdownAttributes<T extends MarkdownElementType | JSXElementConstructor> = T extends MarkdownElementType
	? MarkdownIntrinsicElements[T]
	: T extends JSXElementConstructor<infer TProperties>
	? TProperties
	: never;
