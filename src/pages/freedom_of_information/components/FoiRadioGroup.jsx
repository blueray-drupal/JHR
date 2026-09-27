import React from 'react';

/**
 * Radio group bound to a single Drupal webform key.
 *
 * @param {string} name              - Drupal `#webform_key`
 * @param {Array<{value,label}>} options
 * @param {string} value             - Currently selected machine value
 * @param {Function} onChange        - (value) => void
 */
const FoiRadioGroup = ({ name, options, value, onChange }) => (
    <div className="foi-radios">
        {options.map((option) => (
            <label key={option.value} className="foi-radio-label">
                <input
                    type="radio"
                    className="foi-radio"
                    name={name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => onChange(option.value)}
                />
                <span>{option.label}</span>
            </label>
        ))}
    </div>
);

export default FoiRadioGroup;
