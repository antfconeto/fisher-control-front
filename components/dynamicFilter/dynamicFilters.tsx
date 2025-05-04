import React from "react";
import styles from "@/components/dynamicFilter/dynamicFilters.module.css"; 
import classNames from "classnames";
import { FilterFieldConfig, FilterOption } from "@/types/components"

interface DynamicFiltersProps {
  name:string;
  filters: FilterFieldConfig[];
}

const DynamicFilters: React.FC<DynamicFiltersProps> = ({ filters,name }) => {
  return (
    <section className={styles.filterSection}>
      <div className={styles.filterLabel}>
        <span>{name}</span>
      </div>
      <div className={styles.filterContainer}>
        {filters.map((filter) => {
          const Icon = filter.icon;

          const inputClass = classNames(styles.filterInput, {
            [styles.small]: filter.size === "small",
            [styles.medium]: filter.size === "medium",
            [styles.large]: filter.size === "large",
          });

          return (
            <div key={filter.key} className={inputClass}>
              {Icon && <Icon className={styles.filterIcon} />}

              {filter.type === "text" || filter.type === "number" ? (
                <input
                  type={filter.type}
                  placeholder={filter.placeholder}
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                />
              ) : filter.type === "select" ? (
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className={styles.filterSelect}
                >
                  {filter.selectOptions?.map((option:FilterOption) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export {DynamicFilters};
