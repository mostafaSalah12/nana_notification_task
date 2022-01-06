const {getTemplateByFileName} = require('../util/templates_processor')


//jest.setTimeout(100000)

describe('get templates by names', () => {

 
  it('should return template content if the template is avaliable', async () => {
    const content = await getTemplateByFileName('happy_new_year.txt')
    expect(content).toBe('Happy new year!')
  })

  it('should throw error "template not found" if the template not exisits', async () => {
   try{
    await getTemplateByFileName("not_exisiting_name")
   }catch(err){
    expect(err).toBe("template not found!")
   }
  })
})
