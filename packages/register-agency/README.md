# Файлове

Свали някак всички XML-ли и зипове и ги постави в една директория: [.xml-data](.xml-data)
Ако има зип файлове, ги разархивирай рекурсивно: 
```shell
find ./.xml-data -type f -name "*.zip" -exec sh -c 'for f; do dir="$(dirname "$f")/$(basename "$f" .zip)"; if [ -d "$dir" ] && [ "$(ls -A "$dir")" ]; then echo "Пропускане (вече разархивирано): $dir"; continue; fi; mkdir -p "$dir"; echo "Разархивиране в $dir"; unzip -o "$f" -d "$dir"; done' sh {} +
```

```javascript
(async () => {
  let sections = [
    {url: 'https://data.egov.bg/organisation/dataset/07dd2a58-f96e-48d9-82c9-9aa0b7513e0e', pages: 100},
    {url: 'https://data.egov.bg/organisation/dataset/b30521d2-8a3f-48e7-9df6-f99018c2dcae', pages: 7},
    {url: 'https://data.egov.bg/organisation/dataset/b199b6fe-ded0-4b83-85e3-ea50016596bc', pages: 8},
    {url: 'https://data.egov.bg/organisation/dataset/b05cf9fa-8cc6-484f-814e-3665b59e971c', pages: 8},
    {url: 'https://data.egov.bg/organisation/dataset/db3fde9a-c6a4-4e2d-a98f-e81ab30b5a98', pages: 8},
    {url: 'https://data.egov.bg/organisation/dataset/68b23552-1a71-4eff-ad2b-6389ff5f1954', pages: 8},
    {url: 'https://data.egov.bg/organisation/dataset/feed3736-815a-44ba-a290-b8927b6616b3', pages: 8},
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
            let fileName = $link.find('.version').text();
            fileName = fileName.replace(/.*регистър/, '');
            fileName = fileName.replace('.г', '');
            fileName = $.trim(fileName);
            
            links.push(`wget -O ${fileName}.xml https://data.egov.bg/resource/download/${id}/xml`);
            links = [...new Set(links)];
          });
          console.log(links.join("\n"));
        },
      });
    }
  }
})();
```

## Търговски регистър (latest) (100 стр.)

https://data.egov.bg/organisation/dataset/07dd2a58-f96e-48d9-82c9-9aa0b7513e0e

## Търговски регистър 2022-04-06 г. (7 стр.)

https://data.egov.bg/organisation/dataset/b30521d2-8a3f-48e7-9df6-f99018c2dcae

## Търговски регистър 2022-07-09 г. (8 стр.)

https://data.egov.bg/organisation/dataset/b199b6fe-ded0-4b83-85e3-ea50016596bc

## Търговски регистър 2022-01-03 г. (8 стр.)

https://data.egov.bg/organisation/dataset/b05cf9fa-8cc6-484f-814e-3665b59e971c

## Търговски регистър 2021-10-12 г. (8 стр.)

https://data.egov.bg/organisation/dataset/db3fde9a-c6a4-4e2d-a98f-e81ab30b5a98

## Търговски регистър 2021-07-09 г. (8 стр.)

https://data.egov.bg/organisation/dataset/68b23552-1a71-4eff-ad2b-6389ff5f1954

## Търговски регистър 2021-04-06 г. (8 стр.)

https://data.egov.bg/organisation/dataset/feed3736-815a-44ba-a290-b8927b6616b3

## Търговски регистър 2021-01-03 г.

X https://data.egov.bg/organisation/dataset/f582db02-b1a8-4f9b-b55b-db576034c08c

## Търговски регистър 2021-01-03 г.

X https://data.egov.bg/organisation/dataset/0dc1b39e-ac70-4b3d-bd50-f57ccf12646a

## Търговски регистър 2020 г.

X https://data.egov.bg/organisation/dataset/34b81b5a-3d78-43ce-ad92-5395109a2353

## Търговски регистър 2019 г.

X https://data.egov.bg/organisation/dataset/39c760e4-d073-42d4-a626-1b339ec50316

## Търговски регистър 2018 г.

X https://data.egov.bg/organisation/dataset/98df7b18-8615-466b-9657-9ab14db4fd21

## Търговски регистър 2017

X https://data.egov.bg/organisation/dataset/c4bc48cc-9d2e-4b53-afde-f6a9e0230a9d

## Търговски регистър 2016 г.

X https://data.egov.bg/organisation/dataset/55663cf5-4738-4270-b43c-425b0ee8b954

## Търговски регистър 2015 г.

X https://data.egov.bg/organisation/dataset/b036407b-0973-450e-9f4d-ac2784aef4d8

## Търговски регистър 2014 г.

X https://data.egov.bg/organisation/dataset/8ecfa4b7-130e-43b5-8753-a541855c60eb

## Търговски регистър 2013 г.

X https://data.egov.bg/organisation/dataset/cede3eb8-ff1b-4a77-8efc-e7396c68836b

## Търговски регистър 2012 г.

X https://data.egov.bg/organisation/dataset/eef58388-a79e-4903-9158-9ec3c704189f

## Търговски регистър 2011

X https://data.egov.bg/organisation/dataset/e71db42a-2574-4930-8a7e-53c82537e7ae

## Търговски регистър 2010

X https://data.egov.bg/organisation/dataset/a7c005a5-733c-4d1a-925b-2164c6fb68e1

## Търговски регистър 2009

X https://data.egov.bg/organisation/dataset/6ebd065b-189b-47cc-88cc-dcae0f6fc482

## Търговски регистър 2008 г.

X https://data.egov.bg/organisation/dataset/22226afe-d7b8-4770-95ba-608ea76a8375

# Други

## @todo

След като имаш всички файлове, виж дали има повтарящи се имена (покажи всички, реплиис всичко преди "/" виж уникалните
линии) ако са уникални махни префикса

## Рекурсивно разархивиране на всички zip файлове (директория BRRA-ZIP)

```shell
find ./BRRA-ZIP -type f -name "*.zip" -exec sh -c 'for f; do dir="$(dirname "$f")/$(basename "$f" .zip)"; if [ -d "$dir" ] && [ "$(ls -A "$dir")" ]; then echo "Пропускане (вече разархивирано): $dir"; continue; fi; mkdir -p "$dir"; echo "Разархивиране в $dir"; unzip -o "$f" -d "$dir"; done' sh {} +
```

## Премести всички XML в една директория, като им слага уникален префикс (директория BRRA-XML)

```shell
mkdir -p ./BRRA-XML && find ./BRRA-ZIP -type f -name "*.xml" -exec sh -c 'for f; do dest="./BRRA-XML/$(basename "$f")"; if [ -e "$dest" ]; then dest="./BRRA-XML/$(date +%s)_$(basename "$f")"; fi; mv "$f" "$dest"; done' sh {} +
```

## XML to JSON (директория BRRA-JSON)

```shell
npm install -g xml-js
mkdir -p ./BRRA-JSON && for f in ./BRRA-XML/*.xml; do base=$(basename "$f" .xml); out="./BRRA-JSON/${base}.json"; if [ -f "$out" ]; then echo "Пропускане (вече съществува): $out"; continue; fi; echo "Обработка: $f → $out"; xml-js "$f" --compact --spaces 2 > "$out"; done
```

## Търсене на стринг из файловете

```shell
find ./BRRA-XML -type f -name "*.xml" -print0 | while IFS= read -r -d '' f; do echo "Searching: $f"; if grep -nH --color=never -F "202413291" "$f"; then echo "--> FOUND in: $f"; else echo "Not found in: $f"; fi; done
```

