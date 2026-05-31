const userEntity=require('./userentity')
const expenseEntity=require('./expensentity')

userEntity.hasMany(expenseEntity,{
    foreignKey:'userId'
})
expenseEntity.belongsTo(userEntity,{
    foreignKey:'userId'
})