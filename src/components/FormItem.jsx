import { FormControl, FormLabel, Input, Typography } from "@mui/joy";
import PropTypes from "prop-types";

const FormItem = ({ label, name, type, value, error, onChange }) => {
	return (
		<FormControl sx={{ width: "100%" }}>
			<FormLabel>{label}</FormLabel>
			<Input
				value={value}
				onChange={onChange}
				error={!!error}
				type={type}
				name={name}
				size="sm"
				sx={{ fontWeight: 500 }}
			/>
			{error && (
				<Typography sx={{ marginTop: "2px", fontWeight: 400 }} level="body-xs" color="danger">
					Error: {error}
				</Typography>
			)}
		</FormControl>
	);
};

FormItem.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	value: PropTypes.string,
	error: PropTypes.string,
	onChange: PropTypes.func.isRequired,
};

export default FormItem;
