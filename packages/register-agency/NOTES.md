Total records: 1 361 701

Махни неактивните компании: https://papagal.bg/eik/200021270/de6c

```txt
UPDATE `companies` AS `c` JOIN `registerAgencyCompanies` AS `rac` ON (`c`.`uic` = `rac`.`uic`) SET
  `c`.`entryDate` = JSON_UNQUOTE(JSON_EXTRACT(`rac`.`data`, '$.UIC._attributes.FieldEntryDate')),
  `c`.`name` = JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.Company._text')),
  `c`.`nameEn` = JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.Transliteration._text')),
  `c`.`legalForm` = CASE JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.LegalForm._attributes.Text'))
    WHEN 'Еднолично дружество с ограничена отговорност' THEN 'ЕООД'
    WHEN 'Еднолично дружество с ограничена отговорност\n' THEN 'ЕООД'
    WHEN 'Дружество с ограничена отговорност' THEN 'ООД'
    WHEN 'Еднолично акционерно дружество' THEN 'ЕАД'
    WHEN 'Акционерно дружество' THEN 'АД'
    WHEN 'Едноличен търговец' THEN 'ЕТ'
    WHEN 'Събирателно дружество' THEN 'СД'
    WHEN 'Командитно дружество' THEN 'КД'
    WHEN 'Кооперация' THEN 'Кооп.'
    WHEN 'Общинско предприятие' THEN 'ОП'
    ELSE 'N/A'
  END,
  `c`.`disctrict` = NULLIF(JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.Seat.Address.District._text')), ''),
  `c`.`url` = NULLIF(SUBSTR(JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.Seat.Contacts.URL._text')), 1, 250), ''),
  `c`.`email` = NULLIF(SUBSTR(JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.Seat.Contacts.EMail._text')), 1, 250), ''),
  `c`.`phone` = NULLIF(SUBSTR(JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.Seat.Contacts.Phone._text')), 1, 250), ''),
  `c`.`nkidCode` = NULLIF(SUBSTR(JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.SubjectOfActivityNKID._attributes.codeNkid')), 1, 15), ''),
  `c`.`nkidText` = NULLIF(SUBSTR(JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.SubjectOfActivityNKID._attributes.textNkid')), 1, 250), ''),
  `c`.`nkidId` = 
    CAST(
    CASE
      WHEN JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.SubjectOfActivityNKID._attributes.idNkid')) REGEXP '^[0-9]+$'
      THEN JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.SubjectOfActivityNKID._attributes.idNkid'))
      ELSE NULL
    END AS UNSIGNED
  )
# WHERE `c`.`uic` = '000001141';
```

## Липсващи файлове

На 2025.12.19 не мога да сваля тези файлове.
Пуснал съм сигнал за първите 21 файла до `4be58c39-0700-4ab0-83de-d889f53b2f00` включително.

```
https://data.egov.bg/data/resourceView/062aeb86-c252-4e15-8ab6-74fccc8d86dd
https://data.egov.bg/data/resourceView/0762351b-61c7-417d-890f-71bdb0da0dca
https://data.egov.bg/data/resourceView/0ee45205-3f37-40df-a6e5-e36225b3f502
https://data.egov.bg/data/resourceView/13b08017-b895-4059-a272-6a55be5c5f28
https://data.egov.bg/data/resourceView/176fe67e-7d6b-41d0-861e-99a927cf9acc
https://data.egov.bg/data/resourceView/217ee5fb-46d1-4711-b0ee-ec83185074c6
https://data.egov.bg/data/resourceView/23d7ad39-338a-429f-9444-c22f139e3fce
https://data.egov.bg/data/resourceView/27bb4ebe-002c-4f7f-9218-0011a494f695
https://data.egov.bg/data/resourceView/2e544960-3e7f-4b19-8100-2b8e61900e4c
https://data.egov.bg/data/resourceView/333644eb-6d4e-4fbd-bda4-1c69b8eb541d
https://data.egov.bg/data/resourceView/3418ecbf-17c1-4bc7-9957-6767849a3cbb
https://data.egov.bg/data/resourceView/3b792237-b2ef-4f6e-b7bd-86ad6e29cda0
https://data.egov.bg/data/resourceView/3cf2fad2-77c5-42dc-b112-3a05bebaa1d7
https://data.egov.bg/data/resourceView/40df2dde-0931-494c-bf8f-567897a3d41a
https://data.egov.bg/data/resourceView/445611b2-4703-445c-a7c3-03ccebd7da9d
https://data.egov.bg/data/resourceView/45dfd25b-f958-44ed-8192-e903e39c13b4
https://data.egov.bg/data/resourceView/47322133-18cc-43e6-871e-937977246881
https://data.egov.bg/data/resourceView/496aba90-f01e-4c47-aa3d-e6474c2c6372
https://data.egov.bg/data/resourceView/4a29e8d1-0794-4529-b42b-ccd0dd8d0cad
https://data.egov.bg/data/resourceView/4a868700-451f-4127-8bf4-0771fe4528f4
https://data.egov.bg/data/resourceView/4be58c39-0700-4ab0-83de-d889f53b2f00
https://data.egov.bg/data/resourceView/515a57b9-8f81-43a7-a832-64c8349ab317
https://data.egov.bg/data/resourceView/517b6f62-9a0d-4e8f-aee9-38062a667d45
https://data.egov.bg/data/resourceView/5277b0f6-7b45-4130-a25e-0586b8848b44
https://data.egov.bg/data/resourceView/5516a253-1e39-4c29-9de3-8ace509aa94b
https://data.egov.bg/data/resourceView/5714ea4b-4122-4814-95ec-fe9601a239eb
https://data.egov.bg/data/resourceView/69d8584b-79bf-47b4-aeeb-70cf5dd51f62
https://data.egov.bg/data/resourceView/6b7a7e1b-f245-4bf0-ac60-3c6579fae329
https://data.egov.bg/data/resourceView/73134944-d8d2-404e-b32b-05f1ecad0495
https://data.egov.bg/data/resourceView/740ef81a-71e0-4fea-9197-1da99364fbbf
https://data.egov.bg/data/resourceView/801499b2-b7fa-4ffc-b779-114a5b2c42de
https://data.egov.bg/data/resourceView/83a79620-1dec-41da-9157-938c62e5c981
https://data.egov.bg/data/resourceView/8ca69839-c08e-4bb2-b8e7-906bc19252d4
https://data.egov.bg/data/resourceView/9846994e-3873-48b2-a6a7-7459d8f71020
https://data.egov.bg/data/resourceView/98e4baae-a723-4728-ad3a-f5db32bc88c6
https://data.egov.bg/data/resourceView/a116b709-30e4-4518-b2c2-24da9ca5c4b8
https://data.egov.bg/data/resourceView/a32c291e-9d71-45f8-bf0f-d6e44d646589
https://data.egov.bg/data/resourceView/ae89e3c0-acd9-4b2c-9c99-79460154a6b4
https://data.egov.bg/data/resourceView/b136c78c-8695-40a7-9f79-7c60debb6690
https://data.egov.bg/data/resourceView/b5b828d6-dbd8-4081-b48b-ddf2c89b93eb
https://data.egov.bg/data/resourceView/b5be57f4-6ce6-4643-a374-b2d17eb20741
https://data.egov.bg/data/resourceView/b6fc7527-27a0-480b-a916-a983db72dff7
https://data.egov.bg/data/resourceView/b9060ffb-a549-47e7-9e7b-db1b20b20624
https://data.egov.bg/data/resourceView/c28ebe00-a6df-4bf3-b317-70e4f5bf1df8
https://data.egov.bg/data/resourceView/c3e0977b-e14f-44e2-883e-c617d5bf5811
https://data.egov.bg/data/resourceView/c5e913cf-f6dd-442e-ab2e-033fe196aad2
https://data.egov.bg/data/resourceView/c795ba9a-093c-48b9-b984-3ad0b5ee11a8
https://data.egov.bg/data/resourceView/cbf3ef8a-7bd0-4189-bbcb-32f808b97366
https://data.egov.bg/data/resourceView/ccfa3e59-83aa-4161-a166-5dd0315ba75c
https://data.egov.bg/data/resourceView/cf03734f-bd08-4851-88a8-957249215f08
https://data.egov.bg/data/resourceView/d0b48837-a8bc-4226-9545-9f51f62f2776
https://data.egov.bg/data/resourceView/d2cb4d16-ed06-46f1-b7ea-10ba4af4c5c2
https://data.egov.bg/data/resourceView/d873de32-c938-4296-824d-9c88e8475a5f
https://data.egov.bg/data/resourceView/db8999ec-9d10-4248-8afc-121b2f5a4766
https://data.egov.bg/data/resourceView/e3b858fe-4743-4965-b64f-fa212dea50d8
https://data.egov.bg/data/resourceView/e647fae6-3449-421d-a000-bf3718ca3fa7
https://data.egov.bg/data/resourceView/e651ab72-a3ca-477c-bbc6-109b8943bfd5
https://data.egov.bg/data/resourceView/ee304ca6-e239-4d8f-ad49-9521e1199154
https://data.egov.bg/data/resourceView/f8481902-44e8-4138-8bbb-b9b05c5de7d8
https://data.egov.bg/data/resourceView/f9d09edb-348f-4ee2-8262-1c58ffb94e7a
```