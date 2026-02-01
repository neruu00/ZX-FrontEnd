interface ValidationResult {
  isValid: boolean;
  errors: string[];
  value: any;
}

export default class Validator {
  private value: any;
  private errors: string[] = [];
  private fieldName: string;

  constructor(value: any, fieldName: string = 'Value') {
    this.value = value;
    this.fieldName = fieldName;
  }

  isYoutubeUrl(customMessage?: string): this {
    if (this.errors.length > 0) return this;

    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S*)?$/;

    if (typeof this.value !== 'string' || !youtubeRegex.test(this.value)) {
      this.errors.push(
        customMessage || `${this.fieldName} must be a valid YouTube URL`,
      );
    }

    return this;
  }

  extractYoutubeId(): string | null {
    if (typeof this.value !== 'string') return null;

    const regex =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = this.value.match(regex);

    return match && match[2].length === 11 ? match[2] : null;
  }

  isObjectId(customMessage?: string): this {
    if (this.errors.length > 0) return this;

    const objectIdRegex = /^[a-f\d]{24}$/i;

    if (typeof this.value !== 'string' || !objectIdRegex.test(this.value)) {
      this.errors.push(
        customMessage || `${this.fieldName} must be a valid MongoDB ObjectId`,
      );
    }

    return this;
  }

  isISBN13(customMessage?: string): this {
    if (this.errors.length > 0) return this;

    // 하이픈 제거
    const isbn =
      typeof this.value === 'string' ? this.value.replace(/-/g, '') : '';

    // 길이 체크
    if (isbn.length !== 13 || !/^\d{13}$/.test(isbn)) {
      this.errors.push(
        customMessage || `${this.fieldName} must be a valid ISBN-13`,
      );
      return this;
    }

    // checksum
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(isbn[i], 10);
      sum += i % 2 === 0 ? digit : digit * 3;
    }

    const checkDigit = (10 - (sum % 10)) % 10;

    if (checkDigit !== parseInt(isbn[12], 10)) {
      this.errors.push(
        customMessage || `${this.fieldName} has an invalid ISBN-13 checksum`,
      );
    }

    return this;
  }

  required(customMessage?: string): this {
    if (this.value === null || this.value === undefined || this.value === '') {
      this.errors.push(customMessage || `${this.fieldName} is required`);
    }

    return this;
  }

  isString(customMessage?: string): this {
    if (this.errors.length > 0) return this;

    if (typeof this.value !== 'string') {
      this.errors.push(customMessage || `${this.fieldName} must be a string`);
    }

    return this;
  }

  minLength(length: number, customMessage?: string): this {
    if (this.errors.length > 0) return this;

    if (typeof this.value === 'string' && this.value.length < length) {
      this.errors.push(
        customMessage ||
          `${this.fieldName} must be at least ${length} characters`,
      );
    }

    return this;
  }

  maxLength(length: number, customMessage?: string): this {
    if (this.errors.length > 0) return this;

    if (typeof this.value === 'string' && this.value.length > length) {
      this.errors.push(
        customMessage ||
          `${this.fieldName} must be at most ${length} characters`,
      );
    }

    return this;
  }

  matches(pattern: RegExp, customMessage?: string): this {
    if (this.errors.length > 0) return this;

    if (typeof this.value === 'string' && !pattern.test(this.value)) {
      this.errors.push(
        customMessage ||
          `${this.fieldName} does not match the required pattern`,
      );
    }

    return this;
  }

  validate(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      value: this.value,
    };
  }

  validateOrThrow(): any {
    if (this.errors.length > 0) {
      throw new Error(this.errors.join(', '));
    }
    return this.value;
  }

  getFirstError(): string | null {
    return this.errors.length > 0 ? this.errors[0] : null;
  }

  getErrors(): string[] {
    return this.errors;
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }
}
