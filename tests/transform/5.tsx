// Checking components

const Hello = (props: { name: string }) => {
	return <p>Hello, {props.name}!</p>;
};

export default (
	<root>
		<Hello name="world" />
	</root>
);
