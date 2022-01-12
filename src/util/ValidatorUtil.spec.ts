import {ValidationRule, ValidatorUtil} from "./ValidatorUtil";

describe('validate null options', () => {
    it('verify with value', function () {
        expect(new ValidatorUtil("item").isValid()).toBe(true);
        expect(new ValidatorUtil("item").canBeNull().isValid()).toBe(true);
        expect(new ValidatorUtil("item").canBeNull(true).isValid()).toBe(true);
        expect(new ValidatorUtil("item").canBeNull(false).isValid()).toBe(true);
    });

    it('verify null parameter', function () {
        expect(new ValidatorUtil(null).isValid()).toBe(false);
        expect(new ValidatorUtil(null).canBeNull().isValid()).toBe(true);
        expect(new ValidatorUtil(null).canBeNull(true).isValid()).toBe(true);
        expect(new ValidatorUtil(null).canBeNull(false).isValid()).toBe(false);
    });
});

describe('validate empty options', () => {
    it('verify with value', function () {
        expect(new ValidatorUtil("item").isValid()).toBe(true);
        expect(new ValidatorUtil("item").canBeEmpty().isValid()).toBe(true);
        expect(new ValidatorUtil("item").canBeEmpty(true).isValid()).toBe(true);
        expect(new ValidatorUtil("item").canBeEmpty(false).isValid()).toBe(true);
    });

    it('verify empty parameter', function () {
        expect(new ValidatorUtil("").isValid()).toBe(false);
        expect(new ValidatorUtil("").canBeEmpty().isValid()).toBe(true);
        expect(new ValidatorUtil("").canBeEmpty(true).isValid()).toBe(true);
        expect(new ValidatorUtil("").canBeEmpty(false).isValid()).toBe(false);
    });
});

describe('validate equal options', () => {
    it('verify simple equal', function () {
        expect(new ValidatorUtil("item").equal("item").isValid()).toBe(true);
        expect(new ValidatorUtil("item").equal("other").isValid()).toBe(false);
        expect(new ValidatorUtil("item").equal("Item").isValid()).toBe(false);
        expect(new ValidatorUtil("value123").equal("value123").isValid()).toBe(true);
    });
    it('verify equal ignore case', function () {
        expect(new ValidatorUtil("item").equalIgnoreCase("item").isValid()).toBe(true);
        expect(new ValidatorUtil("item").equalIgnoreCase("other").isValid()).toBe(false);
        expect(new ValidatorUtil("item").equalIgnoreCase("IteM").isValid()).toBe(true);
        expect(new ValidatorUtil("value123").equalIgnoreCase("VALue123").isValid()).toBe(true);
    });


});

describe('validate numeric options', () => {
    it('verify numeric', function () {
        expect(new ValidatorUtil("item").isNumeric().isValid()).toBe(false);
        expect(new ValidatorUtil("1234").isNumeric().isValid()).toBe(true);
        expect(new ValidatorUtil("12.56").isNumeric().isValid()).toBe(true);
        expect(new ValidatorUtil("item").isNumeric(false).isValid()).toBe(true);
        expect(new ValidatorUtil("item").isNumeric(true).isValid()).toBe(false);
    });
});

describe('validate length options', () => {
    it('verify min length validations', function () {
        expect(new ValidatorUtil("item").isMinLength(2).isValid()).toBe(true);
        expect(new ValidatorUtil("item").isMinLength(4).isValid()).toBe(true);
        expect(new ValidatorUtil("item").isMinLength(5).isValid()).toBe(false);
    });

    it('verify max length validations', function () {
        expect(new ValidatorUtil("item").isMaxLength(8).isValid()).toBe(true);
        expect(new ValidatorUtil("item").isMaxLength(4).isValid()).toBe(true);
        expect(new ValidatorUtil("item").isMaxLength(2).isValid()).toBe(false);
    });

    it('verify min and max length validations', function () {
        expect(new ValidatorUtil("item").isMinLength(2).isMaxLength(8).isValid()).toBe(true);
        expect(new ValidatorUtil("item").isMinLength(4).isMaxLength(4).isValid()).toBe(true);
        expect(new ValidatorUtil("ite").isMinLength(4).isMaxLength(4).isValid()).toBe(false);
        expect(new ValidatorUtil("items").isMinLength(4).isMaxLength(4).isValid()).toBe(false);

        expect(new ValidatorUtil("item").sizeLength(2, 8).isValid()).toBe(true);
        expect(new ValidatorUtil("item").sizeLength(4, 4).isValid()).toBe(true);
        expect(new ValidatorUtil("ite").sizeLength(4, 4).isValid()).toBe(false);
        expect(new ValidatorUtil("items").sizeLength(4, 4).isValid()).toBe(false);
    });
});

describe('validate include values', () => {
    it('verify include options', function () {
        const validator = new ValidatorUtil("").includeOptions('CARD_PRESENT', 'NATURAL_RATE');
        expect(validator.setValue("CARD_PRESENT").isValid()).toBe(true);
        expect(validator.setValue("NATURAL_RATE").isValid()).toBe(true);
        expect(validator.setValue("CARD_PRESENTE").isValid()).toBe(false);
        expect(validator.setValue("other").isValid()).toBe(false);
    });

});

describe('validate regex options', () => {
    it('verify success regex', function () {

        const emailRegex = '^([A-Z|a-z|0-9](\\.|_){0,1})+[A-Z|a-z|0-9]\\@([A-Z|a-z|0-9])+((\\.){0,1}[A-Z|a-z|0-9]){2}\\.[a-z]{2,3}$';
        const emailValidator = new ValidatorUtil('').withRegex(emailRegex);
        expect(emailValidator.setValue("abc.abc@domain.com").isValid()).toBe(true);
        expect(emailValidator.setValue("abc@insta..com").isValid()).toBe(false);

        const IpRegex = '^(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))$';
        const IpValidator = new ValidatorUtil('').withRegex(IpRegex);
        expect(IpValidator.setValue("192.168.100.255").isValid()).toBe(true);
        expect(IpValidator.setValue("127.0.0.1").isValid()).toBe(true);
        expect(IpValidator.setValue("127.0.x.1").isValid()).toBe(false);
        expect(IpValidator.setValue("127.0.0.1.8").isValid()).toBe(false);

        const digitRegex = '^\\d+$';
        const digitValidator = new ValidatorUtil('').withRegex(digitRegex);

        expect(digitValidator.setValue("192.168.100.255").isValid()).toBe(false);
        expect(digitValidator.error).toBe(ValidationRule.INCLUDE_REGEX);

        expect(digitValidator.setValue("127 56").isValid()).toBe(false);
        expect(digitValidator.setValue("127a23").isValid()).toBe(false);
        expect(digitValidator.setValue("12793843243245235").isValid()).toBe(true);
    });

});

describe('validate static method', () => {
    it('verify validation with template', function () {
        const rule = {
            isRequired: true,
            isEmpty: true,
            isNumeric: false,
            isEqual: null,
            isEqualIgnoreCase: null,
            minLength: 0,
            maxLength: 0,
            regex: null
        }

        const rule2 = {
            isRequired: true,
            isEmpty: true
        }

        const rule3 = {
            isRequired: true,
            isNumeric: true,
            minLength: 10,
            maxLength: 10,
        }

        expect(ValidatorUtil.validate('127a23', rule).isValid).toBe(true);
        expect(ValidatorUtil.validate(null, rule2).isValid).toBe(false);
        expect(ValidatorUtil.validate('0239650517', rule3).isValid).toBe(true);
        expect(ValidatorUtil.validate('02396505179', rule3).isValid).toBe(false);

        const result = ValidatorUtil.validate('023a650517', rule3);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ValidationRule.NUMERIC);

    });

});


