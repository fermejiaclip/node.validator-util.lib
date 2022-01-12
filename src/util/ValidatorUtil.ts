export class ValidatorUtil {
    value: string;
    private required: boolean;
    private empty: boolean;
    private numeric: boolean;
    private equalValue: string;
    private equalIgnoreCaseValue: string;
    private minLength: number;
    private maxLength: number;
    private includeOptionsList: string[] = [];
    private regex: string;
    private rules: ValidationRule[] = [];
    public error: ValidationRule;

    constructor(value) {
        this.value = value;
        this.required = true;
        this.empty = false;
        this.equalValue = null;
        this.equalIgnoreCaseValue = null;
        this.numeric = false;
        this.minLength = -1;
        this.maxLength = -1;
    }

    setValue(value: string) {
        this.value = value;
        return this;
    }

    canBeNull(option: boolean = true) {
        this.required = !option;
        return this;
    }

    canBeEmpty(option: boolean = true) {
        this.empty = option;
        return this;
    }

    isNumeric(option: boolean = true) {
        if (option) {
            this.rules.push(ValidationRule.NUMERIC);
        }
        this.numeric = option;
        return this;
    }

    equal(option: string) {
        this.rules.push(ValidationRule.EQUAL_VALUE);
        this.equalValue = option;
        return this;
    }

    equalIgnoreCase(option: string) {
        this.rules.push(ValidationRule.EQUAL_IGNORE_CASE);
        this.equalIgnoreCaseValue = option;
        return this;
    }

    isMinLength(size: number) {
        this.rules.push(ValidationRule.MIN_LENGTH);
        this.minLength = size;
        return this;
    }

    isMaxLength(size: number) {
        this.rules.push(ValidationRule.MAX_LENGTH);
        this.maxLength = size;
        return this;
    }

    sizeLength(sizeMin: number, sizeMax: number) {
        this.rules.push(ValidationRule.MIN_LENGTH);
        this.rules.push(ValidationRule.MAX_LENGTH);
        this.minLength = sizeMin;
        this.maxLength = sizeMax;
        return this;
    }

    includeOptions(...options: string[]) {
        this.rules.push(ValidationRule.INCLUDE_OPTIONS);
        this.includeOptionsList = options;
        return this;
    }

    withRegex(regex: string) {
        this.rules.push(ValidationRule.INCLUDE_REGEX);
        this.regex = regex;
        return this;
    }

    isValid() {
        if (this.value === null) {
            if (this.required) {
                this.error = ValidationRule.REQUIRED;
                return false;
            }
            return true;
        }
        if (this.value === "") {
            if (!this.empty) {
                this.error = ValidationRule.EMPTY;
                return false;
            }
            return true;
        }

        for (const rule of this.rules) {
            switch (rule) {
                case ValidationRule.EQUAL_VALUE:
                    if (this.value !== this.equalValue) {
                        this.error = ValidationRule.EQUAL_VALUE;
                        return false;
                    }
                    return true;
                case ValidationRule.EQUAL_IGNORE_CASE:
                    if (this.value.toUpperCase() !== this.equalIgnoreCaseValue.toUpperCase()) {
                        this.error = ValidationRule.EQUAL_IGNORE_CASE;
                        return false;
                    }
                    return true;
                case ValidationRule.NUMERIC:
                    if (Number.isNaN(Number(this.value))) {
                        this.error = ValidationRule.NUMERIC;
                        return false;
                    }
                    break;
                case ValidationRule.MIN_LENGTH:
                    if (this.minLength > 0 && this.value.length < this.minLength) {
                        this.error = ValidationRule.MIN_LENGTH;
                        return false;
                    }
                    break;
                case ValidationRule.MAX_LENGTH:
                    if (this.maxLength > 0 && this.value.length > this.maxLength) {
                        this.error = ValidationRule.MAX_LENGTH;
                        return false;
                    }
                    break;
                case ValidationRule.INCLUDE_OPTIONS:
                    if (!this.includeOptionsList.includes(this.value)) {
                        this.error = ValidationRule.INCLUDE_OPTIONS;
                        return false;
                    }
                    break;
                case ValidationRule.INCLUDE_REGEX:
                    if (!new RegExp(this.regex).test(this.value)) {
                        this.error = ValidationRule.INCLUDE_REGEX;
                        return false;
                    }
            }
        }

        return true;
    }

    static validate(value: string, rule:
        {
            isRequired?: boolean,
            isEmpty?: boolean,
            isNumeric?: boolean,
            isEqual?: string,
            isEqualIgnoreCase?: string,
            minLength?: number,
            maxLength?: number,
            regex?: string
        }) {


        const validator = new ValidatorUtil(value);
        if (rule.isRequired !== undefined && !rule.isRequired) {
            validator.canBeNull();
        }
        if (rule.isEmpty !== undefined && rule.isEmpty) {
            validator.canBeEmpty();
        }
        if (rule.isNumeric !== undefined && rule.isNumeric) {
            validator.isNumeric();
        }
        if (rule.isEqual !== undefined && rule.isEqual) {
            validator.equal(rule.isEqual);
        }
        if (rule.isEqualIgnoreCase !== undefined && rule.isEqualIgnoreCase) {
            validator.equalIgnoreCase(rule.isEqualIgnoreCase);
        }
        if (rule.minLength !== undefined && rule.minLength) {
            validator.isMinLength(rule.minLength);
        }
        if (rule.maxLength !== undefined && rule.maxLength) {
            validator.isMaxLength(rule.maxLength);
        }
        if (rule.regex !== undefined && rule.regex) {
            validator.withRegex(rule.regex);
        }

        const result = { isValid: validator.isValid(), error: validator.error };
        return result;
    }

}
export enum ValidationRule {
    REQUIRED,
    EMPTY,
    NUMERIC,
    EQUAL_VALUE,
    EQUAL_IGNORE_CASE,
    MIN_LENGTH,
    MAX_LENGTH,
    INCLUDE_OPTIONS,
    INCLUDE_REGEX,

}


