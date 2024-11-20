import { FormControl, FormLabel, Radio,RadioGroup,  Typography } from "@mui/joy";
import PropTypes from "prop-types";

const FormRadio = ({ label, name, value, error, onChange, options }) => {
	return (
		<FormControl sx={{ width: "100%" }}>
			<FormLabel>{label}</FormLabel>
			<RadioGroup
				value={value}
				onChange={onChange}
				name={name}
				size="sm"
				sx={{ fontWeight: 500 }}
			>
                {/* <Option value=""></Option> */}
              {options?.map((option) => (
                <Radio key={option} value={option} label={option}/>
              ))}

            </RadioGroup>
			{error && (
				<Typography sx={{ marginTop: "2px", fontWeight: 400 }} level="body-xs" color="danger">
					Error: {error}
				</Typography>
			)}
		</FormControl>
	);
};

FormRadio.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string.isRequired,
	value: PropTypes.string,
	error: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	options: PropTypes.array,
};
export default FormRadio;
