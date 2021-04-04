const ProjectService = {
    getAllProjects(knex, user_id) {
        return knex.select('*')
        .where('user_id', user_id)
        .from('projects')
        .orderBy('id', 'desc')
    },

    insertProject(knex, newProject) {
        return knex
            .insert(newProject)
            .into('projects')
            .returning('*')
            .then(rows => rows[0])
    },

    getById(knex, id, user_id) {
        return knex
            .from('projects')
            .select('*')
            .where('id', id)
            .where('user_id', user_id)
            .first()
    },

    deleteProject(knex, id, user_id) {
        return knex('projects')
            .where({id})
            .where('user_id', user_id)
            .delete()
    },

    updateProject(knex, id, newProjectFields, user_id) {
        return knex('projects')
            .where({id})
            .where('user_id', user_id)
            .update(newProjectFields)
    }
}

module.exports = ProjectService