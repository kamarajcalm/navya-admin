
import TextField from "@material-ui/core/TextField";
import React from 'react';
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";


const SearchBar = ({ setSearchQuery,searchValue="" }) => (
  <form>
    <TextField
      variant="outlined"
      id="search-bar"
      className="text"
      onInput={(e) => {
        setSearchQuery(e.target.value);
      }}
      value={searchValue}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        )
      }}
    />
  </form>
);
export default SearchBar