import React from "react";
import { useListingsFilter } from "../../state/store";
import { Dropdown } from "../../components";
import {
  listingsFilterOptions,
  listingsFilterTitles,
} from "../../utils/references";

import { MdSort } from "react-icons/md";

const ListingsFilter: React.FC = () => {
  const { listingsFilter, setListingsFilter } = useListingsFilter();
  return (
    <div className="f-row f-center container">
      <div className="f-row f-center">
        <MdSort className="icon" />
        <div>Sort by: </div>
      </div>
      <Dropdown
        value={listingsFilter.type}
        handleSubmit={(value) =>
          setListingsFilter({ type: value, labelIds: listingsFilter.labelIds })
        }
        fieldEditingProps={{
          key: "listingsFilterType",
          typename: "Catalogue",
          id: "",
        }}
      >
        <Dropdown.Toggle className="sort-btn" />
        <Dropdown.Menu>
          {listingsFilterOptions
            .filter((option) => option !== listingsFilter.type)
            .map((option: string) => (
              <Dropdown.Item
                title={listingsFilterTitles[option]}
                className="btn"
                key={option}
                value={option}
              >
                {option}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ListingsFilter;
