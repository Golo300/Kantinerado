describe('Login, Navigation and Menu Creation Test', () => {
  it('should navigate to the login page and log in successfully', async () => {
    await browser.get('http://localhost:4200');
    const loginButton = element(by.cssContainingText('.btn.btn-success', 'Anmelden'));
    await loginButton.click();

    let currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toContain('/login');

    const usernameInput = element(by.id('username'));
    const passwordInput = element(by.id('password'));
    await usernameInput.sendKeys('admin');
    await passwordInput.sendKeys('password');

    const submitButton = element(by.cssContainingText('.btn.btn-success', 'Anmelden'));
    await submitButton.click();

    const logoutButton = element(by.cssContainingText('.btn.btn-outline-success', 'Abmelden'));
    expect(await logoutButton.isPresent()).toBe(true);
  });

  it('should navigate to menu management and move two weeks ahead', async () => {
    const menuManagementLink = element(by.cssContainingText('.nav-link', 'Menü-Verwaltung'));
    await menuManagementLink.click();

    let currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toContain('/dashboard/mealplan');

    var nextWeekButton = element(by.css('#next-week'));
    await nextWeekButton.click();
    await nextWeekButton.click();
    await browser.driver.sleep(1000);

    expect(await nextWeekButton.isPresent()).toBe(true);
  });

  it('should create a Menu 1 item using radio button', async () => {
    const menu1Dropdown = element(by.id('planMenu1'));
    await menu1Dropdown.click();

    const radioButton = element(by.css('input[name="dishSelect"]'));
    await radioButton.click();

    await browser.executeScript('window.scrollTo(0, 1000);');
    await browser.driver.sleep(1000);

    const planButton = element(by.id('btnPlanDishMenu'));
    await planButton.click();

    await browser.executeScript('window.scrollTo(0, 0);');
    await browser.driver.sleep(1000);

    expect(await planButton.isPresent()).toBe(true);
  });

  it('should navigate to order view and place an order', async () => {
    const orderViewLink = element(by.cssContainingText('.nav-link', 'Bestell-Übersicht'));
    await orderViewLink.click();

    let currentUrl = await browser.getCurrentUrl();

    const nextWeekButton = element(by.css('#next-week'));
    await nextWeekButton.click();
    await nextWeekButton.click();

    const radioOrderButton = element(by.id("checkBoxMenu1"));
    await radioOrderButton.click();

    expect(await radioOrderButton.isSelected()).toBe(true);

    const addToOrderButton = element(by.id('btnAddToCartLunch'));
    await addToOrderButton.click();

    const finalButton = element(by.cssContainingText('button', 'Bestellung abschließen'));
    await finalButton.click();
  });
});
