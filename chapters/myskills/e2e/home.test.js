describe('Home - E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id('modal-name-input')).typeText('John Doe');
    await element(by.id('modal-name-submit')).tap();
  });

  it('should have a welcome message ', async () => {
    await expect(element(by.id('welcome'))).toBeVisible();
  });

  it('should register a new skill', async () => {
    const skillName = 'React Native';
    const newSkillInput = await element(by.id('new-skill-input'));
    const newSkillButton = await element(by.id('new-skill-button'));
    const skillsList = await element(by.id('skills-list'));

    await newSkillInput.typeText(skillName);
    await newSkillButton.tap();

    await expect(skillsList).toBeVisible();
    await expect(element(by.id(skillName))).toBeVisible();
  });
});
