describe('E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have a welcome message ', async () => {
    await element(by.id('modal-name-input')).typeText('John Doe');
    await element(by.id('modal-name-submit')).tap();
    await expect(element(by.id('welcome'))).toBeVisible();
  });
});
