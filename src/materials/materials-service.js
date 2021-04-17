const MaterialsService = {
    getAllMaterials(knex) {
        return knex.select('*')
        .from('materials')
        .orderBy('id')
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

    updateMaterials(knex, id, newMaterialFields, project_id) {
        return knex('materials')
            .where({id})
            .where('project_id', project_id)
            .update(newMaterialFields)
    }
}

module.exports = MaterialsService