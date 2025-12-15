ALTER TABLE ems_db.eventcustomer
    DROP FOREIGN KEY eventCustomer_event_id_da5248b6_fk_event_eventID;

-- 3. Re-add the foreign key with the CASCADE rule
ALTER TABLE ems_db.eventcustomer
    ADD CONSTRAINT eventCustomer_event_id_da5248b6_fk_event_eventID
    FOREIGN KEY (event_id)
    REFERENCES event (eventID)
    ON DELETE CASCADE;
    
ALTER TABLE `ems_db`.`ticket`
    DROP FOREIGN KEY `ticket_event_id_50ca8740_fk_event_eventID`;

ALTER TABLE `ems_db`.`ticket`
    ADD CONSTRAINT `ticket_event_id_50ca8740_fk_event_eventID`
    FOREIGN KEY (`event_id`)
    REFERENCES `event` (`eventID`)
    ON DELETE CASCADE;