export class Person {
  constructor({
    reg_number,
    first_name,
    last_name,
    email,
    middle_name,
    department,
    year_of_study,
  }) {
    this.reg_number = reg_number;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.middle_name = middle_name;
    this.department = department;
    this.year_of_study = year_of_study;
  }

  viewFields() {
    return {
      reg_number: this.reg_number,
      first_name: this.first_name,
      middle_name: this.middle_name,
      last_name: this.last_name,
      email: this.email,
      department: this.department,
      year_of_study: this.year_of_study,
    };
  }
}
