import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor';

const expectedH1 = 'Tour of Users';
const expectedTitle = `${expectedH1}`;
const targetUser = { id: 15, name: 'Magneta' };
const targetUserDashboardIndex = 2;
const nameSuffix = 'X';
const newUserName = targetUser.name + nameSuffix;

class User {
  constructor(public id: number, public name: string) {}

  // Factory methods

  // User from string formatted as '<id> <name>'.
  static fromString(s: string): User {
    return new User(
      +s.substring(0, s.indexOf(' ')),
      s.slice(s.indexOf(' ') + 1),
    );
  }

  // User from user list <li> element.
  static async fromLi(li: ElementFinder): Promise<User> {
    const stringsFromA = await li.all(by.css('a')).getText();
    const strings = stringsFromA[0].split(' ');
    return { id: +strings[0], name: strings[1] };
  }

  // User id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<User> {
    // Get user id from the first <div>
    const id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    const name = await detail.element(by.css('h2')).getText();
    return {
      id: +id.slice(id.indexOf(' ') + 1),
      name: name.substring(0, name.lastIndexOf(' '))
    };
  }
}

describe('Tutorial part 6', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    const navElts = element.all(by.css('app-root nav a'));

    return {
      navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')),
      topUsers: element.all(by.css('app-root app-dashboard > div a')),

      appUsersHref: navElts.get(1),
      appUsers: element(by.css('app-root app-users')),
      allUsers: element.all(by.css('app-root app-users li')),
      selectedUserSubview: element(by.css('app-root app-users > div:last-child')),

      userDetail: element(by.css('app-root app-user-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, async () => {
      expect(await browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, async () => {
      await expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Dashboard', 'Users'];
    it(`has views ${expectedViewNames}`, async () => {
      const viewNames = await getPageElts().navElts.map(el => el!.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', async () => {
      const page = getPageElts();
      expect(await page.appDashboard.isPresent()).toBeTruthy();
    });

  });

  describe('Dashboard tests', () => {

    beforeAll(() => browser.get(''));

    it('has top users', async () => {
      const page = getPageElts();
      expect(await page.topUsers.count()).toEqual(4);
    });

    it(`selects and routes to ${targetUser.name} details`, dashboardSelectTargetUser);

    it(`updates user name (${newUserName}) in details view`, updateUserNameInDetailView);

    it(`cancels and shows ${targetUser.name} in Dashboard`, async () => {
      await element(by.buttonText('go back')).click();
      await browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      const targetUserElt = getPageElts().topUsers.get(targetUserDashboardIndex);
      expect(await targetUserElt.getText()).toEqual(targetUser.name);
    });

    it(`selects and routes to ${targetUser.name} details`, dashboardSelectTargetUser);

    it(`updates user name (${newUserName}) in details view`, updateUserNameInDetailView);

    it(`saves and shows ${newUserName} in Dashboard`, async () => {
      await element(by.buttonText('save')).click();
      await browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      const targetUserElt = getPageElts().topUsers.get(targetUserDashboardIndex);
      expect(await targetUserElt.getText()).toEqual(newUserName);
    });

  });

  describe('Users tests', () => {

    beforeAll(() => browser.get(''));

    it('can switch to Users view', async () => {
      await getPageElts().appUsersHref.click();
      const page = getPageElts();
      expect(await page.appUsers.isPresent()).toBeTruthy();
      expect(await page.allUsers.count()).toEqual(9, 'number of users');
    });

    it('can route to user details', async () => {
      await getUserLiEltById(targetUser.id).click();

      const page = getPageElts();
      expect(await page.userDetail.isPresent()).toBeTruthy('shows user detail');
      const user = await User.fromDetail(page.userDetail);
      expect(user.id).toEqual(targetUser.id);
      expect(user.name).toEqual(targetUser.name.toUpperCase());
    });

    it(`updates user name (${newUserName}) in details view`, updateUserNameInDetailView);

    it(`shows ${newUserName} in Users list`, async () => {
      await element(by.buttonText('save')).click();
      await browser.waitForAngular();
      const expectedText = `${targetUser.id} ${newUserName}`;
      expect(await getUserAEltById(targetUser.id).getText()).toEqual(expectedText);
    });

    it(`deletes ${newUserName} from Users list`, async () => {
      const usersBefore = await toUserArray(getPageElts().allUsers);
      const li = getUserLiEltById(targetUser.id);
      await li.element(by.buttonText('x')).click();

      const page = getPageElts();
      expect(await page.appUsers.isPresent()).toBeTruthy();
      expect(await page.allUsers.count()).toEqual(8, 'number of users');
      const usersAfter = await toUserArray(page.allUsers);
      // console.log(await User.fromLi(page.allUsers[0]));
      const expectedUsers =  usersBefore.filter(h => h.name !== newUserName);
      expect(usersAfter).toEqual(expectedUsers);
      // expect(page.selectedUserSubview.isPresent()).toBeFalsy();
    });

    it(`adds back ${targetUser.name}`, async () => {
      const addedUserName = 'Alice';
      const usersBefore = await toUserArray(getPageElts().allUsers);
      const numUsers = usersBefore.length;

      await element(by.css('input')).sendKeys(addedUserName);
      await element(by.buttonText('Add user')).click();

      const page = getPageElts();
      const usersAfter = await toUserArray(page.allUsers);
      expect(usersAfter.length).toEqual(numUsers + 1, 'number of users');

      expect(usersAfter.slice(0, numUsers)).toEqual(usersBefore, 'Old users are still there');

      const maxId = usersBefore[usersBefore.length - 1].id;
      expect(usersAfter[numUsers]).toEqual({id: maxId + 1, name: addedUserName});
    });

    it('displays correctly styled buttons', async () => {
      const buttons = await element.all(by.buttonText('x'));

      for (const button of buttons) {
        // Inherited styles from styles.css
        expect(await button.getCssValue('font-family')).toBe('Arial, Helvetica, sans-serif');
        expect(await button.getCssValue('border')).toContain('none');
        expect(await button.getCssValue('padding')).toBe('1px 10px 3px');
        expect(await button.getCssValue('border-radius')).toBe('4px');
        // Styles defined in users.component.css
        expect(await button.getCssValue('left')).toBe('210px');
        expect(await button.getCssValue('top')).toBe('5px');
      }

      const addButton = element(by.buttonText('Add user'));
      // Inherited styles from styles.css
      expect(await addButton.getCssValue('font-family')).toBe('Arial, Helvetica, sans-serif');
      expect(await addButton.getCssValue('border')).toContain('none');
      expect(await addButton.getCssValue('padding')).toBe('8px 24px');
      expect(await addButton.getCssValue('border-radius')).toBe('4px');
    });

  });

  describe('Progressive user search', () => {

    beforeAll(() => browser.get(''));

    it(`searches for 'Ma'`, async () => {
      await getPageElts().searchBox.sendKeys('Ma');
      await browser.sleep(1000);

      expect(await getPageElts().searchResults.count()).toBe(4);
    });

    it(`continues search with 'g'`, async () => {
      await getPageElts().searchBox.sendKeys('g');
      await browser.sleep(1000);
      expect(await getPageElts().searchResults.count()).toBe(2);
    });

    it(`continues search with 'n' and gets ${targetUser.name}`, async () => {
      await getPageElts().searchBox.sendKeys('n');
      await browser.sleep(1000);
      const page = getPageElts();
      expect(await page.searchResults.count()).toBe(1);
      const user = page.searchResults.get(0);
      expect(await user.getText()).toEqual(targetUser.name);
    });

    it(`navigates to ${targetUser.name} details view`, async () => {
      const user = getPageElts().searchResults.get(0);
      expect(await user.getText()).toEqual(targetUser.name);
      await user.click();

      const page = getPageElts();
      expect(await page.userDetail.isPresent()).toBeTruthy('shows user detail');
      const user2 = await User.fromDetail(page.userDetail);
      expect(user2.id).toEqual(targetUser.id);
      expect(user2.name).toEqual(targetUser.name.toUpperCase());
    });
  });

  async function dashboardSelectTargetUser() {
    const targetUserElt = getPageElts().topUsers.get(targetUserDashboardIndex);
    expect(await targetUserElt.getText()).toEqual(targetUser.name);
    await targetUserElt.click();
    await browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

    const page = getPageElts();
    expect(await page.userDetail.isPresent()).toBeTruthy('shows user detail');
    const user = await User.fromDetail(page.userDetail);
    expect(user.id).toEqual(targetUser.id);
    expect(user.name).toEqual(targetUser.name.toUpperCase());
  }

  async function updateUserNameInDetailView() {
    // Assumes that the current view is the user details view.
    await addToUserName(nameSuffix);

    const page = getPageElts();
    const user = await User.fromDetail(page.userDetail);
    expect(user.id).toEqual(targetUser.id);
    expect(user.name).toEqual(newUserName.toUpperCase());
  }

});

async function addToUserName(text: string): Promise<void> {
  const input = element(by.css('input'));
  await input.sendKeys(text);
}

async function expectHeading(hLevel: number, expectedText: string): Promise<void> {
  const hTag = `h${hLevel}`;
  const hText = await element(by.css(hTag)).getText();
  expect(hText).toEqual(expectedText, hTag);
}

function getUserAEltById(id: number): ElementFinder {
  const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

function getUserLiEltById(id: number): ElementFinder {
  const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

async function toUserArray(allUsers: ElementArrayFinder): Promise<User[]> {
  return allUsers.map(user => User.fromLi(user!));
}
