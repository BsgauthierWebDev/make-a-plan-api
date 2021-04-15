const StepsService = {
    getAllSteps(knex, project_id) {
        return knex.select('*')
            .where('project_id', project_id)
            .from('steps')
            .orderBy('id')
    },

    insertSteps(knex, newSteps) {
        return knex
            .insert(newSteps)
            .into('steps')
            .returning('*')
            .then(rows => rows[0])
    },

    getById(knex, id, project_id) {
        return knex
            .from('steps')
            .select('*')
            .where('id', id)
            .where('project_id', project_id)
            .first()
    },

    deleteSteps(knex, id, project_id) {
        return knex('steps')
            .where({id})
            .where('project_id', project_id)
            .delete()
    },

    updateSteps(knex, id, newStepsFields, project_id) {
        return knex('steps')
            .where({id})
            .where('project_id', project_id)
            .update(newStepsFields)
    }
}

module.exports = StepsService