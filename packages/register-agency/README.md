# Файлове

Отваря се https://data.egov.bg и в браузъра се стартира скрипта по-долу и резулатат се слага
в [download-xmls.ts](src/download-xmls.ts)

```javascript
(async () => {
  let sections = [
    // @TODO - нямам списъка за 2026
    {url: 'https://data.egov.bg/organisation/dataset/07dd2a58-f96e-48d9-82c9-9aa0b7513e0e', pages: 110},
    {url: 'https://data.egov.bg/organisation/dataset/0dc1b39e-ac70-4b3d-bd50-f57ccf12646a', pages: 6},
    {url: 'https://data.egov.bg/organisation/dataset/34b81b5a-3d78-43ce-ad92-5395109a2353', pages: 1},
    {url: 'https://data.egov.bg/organisation/dataset/39c760e4-d073-42d4-a626-1b339ec50316', pages: 1},
    {url: 'https://data.egov.bg/organisation/dataset/98df7b18-8615-466b-9657-9ab14db4fd21', pages: 1},
    {url: 'https://data.egov.bg/organisation/dataset/c4bc48cc-9d2e-4b53-afde-f6a9e0230a9d', pages: 1},
    {url: 'https://data.egov.bg/organisation/dataset/55663cf5-4738-4270-b43c-425b0ee8b954', pages: 1},
    {url: 'https://data.egov.bg/organisation/dataset/b036407b-0973-450e-9f4d-ac2784aef4d8', pages: 1},
    {url: 'https://data.egov.bg/organisation/dataset/8ecfa4b7-130e-43b5-8753-a541855c60eb', pages: 1},
    {url: 'https://data.egov.bg/organisation/dataset/cede3eb8-ff1b-4a77-8efc-e7396c68836b', pages: 1},
    {url: 'https://data.egov.bg/organisation/dataset/eef58388-a79e-4903-9158-9ec3c704189f', pages: 1},
    {url: 'https://data.egov.bg/organisation/dataset/e71db42a-2574-4930-8a7e-53c82537e7ae', pages: 1},
    {url: 'https://data.egov.bg/organisation/dataset/a7c005a5-733c-4d1a-925b-2164c6fb68e1', pages: 1},
    {url: 'https://data.egov.bg/organisation/dataset/6ebd065b-189b-47cc-88cc-dcae0f6fc482', pages: 1},
    {url: 'https://data.egov.bg/organisation/dataset/22226afe-d7b8-4770-95ba-608ea76a8375', pages: 1},
    {url: 'https://data.egov.bg/organisation/dataset/b199b6fe-ded0-4b83-85e3-ea50016596bc', pages: 8},
    {url: 'https://data.egov.bg/organisation/dataset/b05cf9fa-8cc6-484f-814e-3665b59e971c', pages: 8},
    {url: 'https://data.egov.bg/organisation/dataset/db3fde9a-c6a4-4e2d-a98f-e81ab30b5a98', pages: 8},
    {url: 'https://data.egov.bg/organisation/dataset/68b23552-1a71-4eff-ad2b-6389ff5f1954', pages: 8},
    {url: 'https://data.egov.bg/organisation/dataset/feed3736-815a-44ba-a290-b8927b6616b3', pages: 8},
    {url: 'https://data.egov.bg/organisation/dataset/f582db02-b1a8-4f9b-b55b-db576034c08c', pages: 1},
    {url: 'https://data.egov.bg/organisation/dataset/b30521d2-8a3f-48e7-9df6-f99018c2dcae', pages: 7},
    {url: 'https://data.egov.bg/organisation/dataset/2df0c2af-e769-4397-be33-fcbe269806f3', pages: 1},
  ];

  let links = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    for (let p = 1; p <= section.pages; p++) {
      await $.ajax({
        url: `${section.url}?rpage=${p}`,
        success: function (response) {
          const $body = $(response);
          $body.find('a[href*="https://data.egov.bg/organisation/datasets/resourceView/"]').each(function () {
            const $link = $(this);
            const id = $link.attr('href').replace(/\?.*/, '').replace(/.*\//, '');
            links.push(`https://data.egov.bg/resource/download/${id}/xml`);
          });

          console.log(JSON.stringify(links));
          console.log(`Left: ${sections.length - i} / ${section.pages - p}`);
        },
      });
    }
  }
})();
```

## Търсене на стринг из файловете

```shell
find ./BRRA-XML -type f -name "*.xml" -print0 | while IFS= read -r -d '' f; do echo "Searching: $f"; if grep -nH --color=never -F "202413291" "$f"; then echo "--> FOUND in: $f"; else echo "Not found in: $f"; fi; done
```

