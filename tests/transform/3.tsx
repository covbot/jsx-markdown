// Checking how jsx transforms handle empty, nullish and non-string values

export default (
	<root>
		{true && 'Hello'}
		{false && 'Hello'}
		{null}
		{undefined}
		{15}
		{0}
		{''}
	</root>
);
