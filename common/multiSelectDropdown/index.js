import React from "react";
import MultiSelect from "react-select";
import './styles.scss';
class MultiSelectDropDown extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { value, options, placeholder, isDisabled, onChange, onFocus, isMulti } =
      this.props;
    return (
      <div className="form-group-select">
        <MultiSelect
          value={value}
          isDisabled={isDisabled ? isDisabled : null}
          onChange={onChange}
          onFocus={onFocus}
          options={options}
          placeholder={placeholder}
          isMulti={isMulti}
        />
      </div>
    );
  }
}

export default MultiSelectDropDown;
