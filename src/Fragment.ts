import { JSXElementConstructor, MarkdownElement, PropertiesWithChildren } from './MarkdownIntrinsicElements';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Fragment: JSXElementConstructor<PropertiesWithChildren<{}>> = ({ children }) => {
	return children as MarkdownElement;
};
