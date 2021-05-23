const MaterialsService = {
    getAllMaterials(knex, user_id) {
        return knex.select('materials.*')
        .from('materials')
        .innerJoin('projects', 'materials.project_id', 'projects.id')
        .where('projects.user_id', user_id)
        .orderBy('materials.id')
    },

    insertMaterials(knex, newMaterials) {
        return knex
            .insert(newMaterials)
            .into('materials')
            .returning('*')
            .then(rows => rows[0])
    },

    getById(knex, id, project_id) {
        return knex
            .from('materials')
            .select('*')
            .where('id', id)
            .where('project_id', project_id)
            .first()
    },

    deleteMaterials(knex, id, project_id) {
        return knex('materials')
            .where({id})
            .where('project_id', project_id)
            .delete()
    },

    updateMaterials(knex, id, newMaterialFields) {
        console.log(id);
        return knex('materials')
            .where('id', id)
            .update(newMaterialFields)
    }
}

module.exports = MaterialsService