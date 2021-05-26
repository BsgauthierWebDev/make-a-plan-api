const StepsService = {
    getAllSteps(knex, user_id) {
        return knex.select('steps.*')
            .from('steps')
            .innerJoin('projects', 'steps.project_id', 'projects.id')
            .where('projects.user_id', user_id)
            .orderBy('steps.id')
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

    updateSteps(knex, id, newStepFields) {
        console.log(id)
        return knex('steps')
            .where('id', id)
            .update(newStepFields)
    }
}

module.exports = StepsService