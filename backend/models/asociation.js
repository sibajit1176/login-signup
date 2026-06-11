const userEntity=require('./userentity')
const expenseEntity=require('./expensentity')
const creditLogEntity = require('./creditlogEntity')

userEntity.hasMany(expenseEntity,{
    foreignKey:'userId'
})
expenseEntity.belongsTo(userEntity,{
    foreignKey:'userId'
})

userEntity.hasMany(creditLogEntity,{
    foreignKey:'userId'
})
creditLogEntity.belongsTo(userEntity,{
    foreignKey:'userId'
})