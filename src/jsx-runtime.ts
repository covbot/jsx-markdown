import { Content, Root } from 'mdast';
import { MarkdownIntrinsicElements } from './MarkdownIntrinsicElements';

type NodeType = keyof MarkdownIntrinsicElements;

const elementToType: Record<NodeType, Content['type'] | Root['type']> = {
	h1: 'heading',
	h2: 'heading',
	h3: 'heading',
	h4: 'heading',
	h5: 'heading',
	h6: 'heading',
	root: 'root',
	p: 'paragraph',
	hr: 'thematicBreak',
	blockquote: 'blockquote',
};

const headingTypeToDepth = {
	h1: 1,
	h2: 2,
	h3: 3,
	h4: 4,
	h5: 5,
	h6: 6,
};

export const jsxs = <TType extends NodeType>(type: TType, props: MarkdownIntrinsicElements[NodeType]): Content => {
	const mdType = elementToType[type];

	let mdNode: Record<string, unknown> = { ...props, type: mdType };

	if (mdType === 'heading') {
		mdNode['depth'] = headingTypeToDepth[type as keyof typeof headingTypeToDepth];
	}

	return mdNode as unknown as Content;
};

export const jsx = <TType extends NodeType>(type: TType, props: MarkdownIntrinsicElements[NodeType]) => {
	if ('children' in props) {
		return jsxs(type, { ...props, children: [props.children] } as unknown as MarkdownIntrinsicElements[NodeType]);
	}

	return jsxs(type, props);
};
