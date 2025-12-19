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