var Database = require("../models/index");

class PlansService {
    constructor() {
        this.Plan = Database['Plan'];
    }
    async getAll() {
        try {
            return await this.Plan.findAll();
        } catch (err) {
            return undefined;
        }
    }
    async getById(id) {
        try {
            return await this.Plan.findByPk(id);
        } catch (err) {
            return undefined;
        }
    }
    async update(id, data) {
        var errors = {};
        var isValid = this.validate(data, errors);
        if (isValid) {
            try {
                var plan = await this.getById(id);
                plan.title = data.title;
                plan.list = data.list;
                plan.client = data.client;
                plan.value = data.value;
                await plan.save();
                return true;
            } catch (err) {
                errors.system_msg = "Não foi possível editar o plano";
                return errors;
            }
        } else {
            return errors;
        }
    }
    async store(plans) {
        var errors = {};
        if (plans.import != undefined) {
            plans.import = true;
        } else {
            plans.import = false;
        }
        var isValid = this.validate(plans, errors);
        if (isValid) {
            try {
                await this.Plan.create(plans);
                return true;
            } catch (err) {
                errors.system_msg = "Não foi possível salvar o plano";
                return errors;
            }
        } else {
            return errors;
        }
    }
    validate(plan, errors) {
        var errorCount = 0;
        if (plan.title == undefined) {
            errors.title_msg = "O título é inválido"
            errorCount++;
        } else {
            if (plan.title.length < 3) {
                errors.title_msg = "O título é inválido"
                errorCount++;
            }
        }
        if (plan.list == undefined) {
            errors.list_msg = "A quantidade de listas é inválida";
            errorCount++;
        } else {
            if (plan.list < 1) {
                errors.list_msg = "A quantidade de listas é inválida";
                errorCount++;
            }
        }
        if (errorCount == 0) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = new PlansService();