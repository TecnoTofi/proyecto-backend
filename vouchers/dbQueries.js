const knex = require('../db/connection');

module.exports = {
    voucher: {
        getAll: function(){
            return knex.select().table('Voucher');
        },
        getOneById: function(id){
            return knex.select().table('Voucher').where('id', id).first();
        },
        getOneByCode: function(code){
            return knex.select().table('Voucher').where('voucher', code).first();
        },
        insert: function(voucher){
            return knex('Voucher').insert(voucher).returning('id');
        },
        delete: function(id){
            return knex('Voucher').where('id', id).del();
        },
        modify: function(id, voucher){
            return knex('Voucher').where('id', id).update({cantidad: voucher.cantidad});
        },
    },
    voucherCompany: {
        getAll: function(){
            return knex.select().table('VoucherCompany');
        },
        getOneById: function(id){
            return knex.select().table('VoucherCompany').where('id', id).first();
        },
        getOneByCompanyIdByVoucher: function(companyId,voucherId){
            return knex.select().table('VoucherCompany').where('companyId', companyId).andWhere('voucherId', voucherId).first();
        },
        getAllByVoucher: function(voucherId){
            return knex.select().table('VoucherCompany').where('voucherId', voucherId);
        },
        getAllByCompany: function(companyId){
            return knex.select().table('VoucherCompany').where('companyId', companyId);
        },
        insert: function(VoucherCompany){
            return knex('VoucherCompany').insert(VoucherCompany).returning('id');
        },
        delete: function(id){
            return knex('VoucherCompany').where('id', id).del();
        }
    }
};