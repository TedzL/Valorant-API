import { ValorantAPI } from "../index";

const val = new ValorantAPI();

test('Successful Account Endpoint', async () => {
    expect( (await val.getAccount({ name: 'KalilSparta', tag: '90210' })).data.data ).toHaveProperty('name', 'KalilSparta');
});