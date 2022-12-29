import { Content, Heading, List, ListItem, PhrasingContent } from 'mdast';
import {
	MarkdownAttributes,
	MarkdownElement,
	MarkdownElementType,
	MarkdownHeadingAttributes,
	MarkdownListAttributes,
} from './MarkdownIntrinsicElements';

type ExtractMarkdownElementType<T> = T extends { type: infer TType } ? TType : never;
type NormalizedAttributes<T> = Omit<T, 'children'> & {
	children: MarkdownElement[];
};

const createSampleElement = <T extends ExtractMarkdownElementType<MarkdownElement>>(type: T) => {
	return ({ children, ...other }: { children: MarkdownElement[] }) => {
		return {
			type,
			children,
			...other,
		} as MarkdownElement;
	};
};

const createHeading = (depth: Heading['depth']) => {
	return ({ children, ...other }: NormalizedAttributes<MarkdownHeadingAttributes>): Heading => ({
		type: 'heading',
		depth,
		children: children as PhrasingContent[],
		...other,
	});
};

const createList = (ordered?: boolean) => {
	return ({ children, ...other }: NormalizedAttributes<MarkdownListAttributes>): List => ({
		type: 'list',
		ordered,
		children: children as ListItem[],
		...other,
	});
};

const createFragmentElement = () => {
	return ({ children }: NormalizedAttributes<{}>) => children as unknown as MarkdownElement;
};

type ElementTableType = {
	[TKey in MarkdownElementType]: (properties: NormalizedAttributes<MarkdownAttributes<TKey>>) => MarkdownElement;
};

const elementTable: ElementTableType = {
	blockquote: createSampleElement('blockquote'),
	root: ({ children }) => ({
		type: 'root',
		children: children as Content[],
	}),
	p: createSampleElement('paragraph'),
	hr: createSampleElement('thematicBreak'),
	h1: createHeading(1),
	h2: createHeading(2),
	h3: createHeading(3),
	h4: createHeading(4),
	h5: createHeading(5),
	h6: createHeading(6),
	ol: createList(true),
	ul: createList(false),
	table: createSampleElement('table'),
	tbody: createFragmentElement(),
	thead: createFragmentElement(),
	tr: createSampleElement('tableRow'),
	td: createSampleElement('tableCell'),
	th: createSampleElement('tableCell'),
	pre: createSampleElement('code'),
	code: createSampleElement('inlineCode'),
};

export const jsxIntoMd = <T extends MarkdownElementType>(
	type: T,
	properties: MarkdownAttributes<T>,
	children: MarkdownElement[],
) => {
	return elementTable[type]({ ...properties, children });
};
