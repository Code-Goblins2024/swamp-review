import { FormControl, FormLabel, Select, Typography, Option } from "@mui/joy";
import PropTypes from "prop-types";
import { useEffect } from "react";

const FormSelect = ({ label, name, value, error, onChange, options }) => {
	return (
		<FormControl sx={{ width: "100%" }}>
			{label && <FormLabel>{label}</FormLabel>}
			<Select
				value={value || ""}
				name={name}
				onChange={(e, newValue) => {
					// Select handles events slightly different, so we construct
					// a custom "event" object that is compatible with the onChange
					// handler used by FormItem components
					const event = {
						target: {
							name: name,
							value: newValue,
						},
					};
					onChange(event);
				}}
				color={error ? "danger" : "neutral"}
				size="sm"
				sx={{ fontWeight: 500 }}
				slotProps={{ listbox: { disablePortal: true } }}
			>
				{/* <Option value=""></Option> */}
				{options?.map((option) => (
					<Option key={option} value={option}>
						{option}
					</Option>
				))}
			</Select>
			{error && (
				<Typography sx={{ marginTop: "2px", fontWeight: 400 }} level="body-xs" color="danger">
					Error: {error}
				</Typography>
			)}
		</FormControl>
	);
};

FormSelect.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string.isRequired,
	value: PropTypes.string,
	error: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	options: PropTypes.array,
};

export default FormSelect;
