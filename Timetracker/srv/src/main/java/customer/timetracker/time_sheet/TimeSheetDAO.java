package customer.timetracker.time_sheet;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
import javax.persistence.StoredProcedureQuery;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import customer.timetracker.errors.BusinessException;

import java.io.IOException;
import java.sql.*;
@Component
public class TimeSheetDAO {
    @PersistenceContext
    private EntityManager entityManager;

    public List<TimeSheet> getApplications(boolean isAllRecords, Long id, TimeSheetEntity timeSheetEntity, Integer pageNumber, Integer pageSize) {
        try {
            String filterParams = "";
            if (timeSheetEntity != null) {
                filterParams = new Gson().toJson(timeSheetEntity);
            }
            timeSheetEntity = timeSheetEntity == null ? new TimeSheetEntity()
                    : timeSheetEntity;

            StoredProcedureQuery sp_GetPropertyGenerator = entityManager
                    .createStoredProcedureQuery("GET_SUPPORT", "TimeSheet_Mapping");
            sp_GetPropertyGenerator.registerStoredProcedureParameter("SHOW_ALL", Boolean.class, ParameterMode.IN);
            sp_GetPropertyGenerator.registerStoredProcedureParameter("ID", Long.class, ParameterMode.IN);
            sp_GetPropertyGenerator.registerStoredProcedureParameter("FILTER_PARAMS", String.class, ParameterMode.IN);
            sp_GetPropertyGenerator.registerStoredProcedureParameter("PAGE_NUMBER", Integer.class, ParameterMode.IN);
            sp_GetPropertyGenerator.registerStoredProcedureParameter("PAGE_SIZE", Integer.class, ParameterMode.IN);
            sp_GetPropertyGenerator.registerStoredProcedureParameter("SORTING_KEY", String.class, ParameterMode.IN);
            sp_GetPropertyGenerator.registerStoredProcedureParameter("ORDER_BY", String.class, ParameterMode.IN);
            sp_GetPropertyGenerator.registerStoredProcedureParameter("STRING_TYPE", Boolean.class, ParameterMode.IN);

            sp_GetPropertyGenerator.setParameter("SHOW_ALL", isAllRecords);
            sp_GetPropertyGenerator.setParameter("ID", id);
            sp_GetPropertyGenerator.setParameter("FILTER_PARAMS", filterParams);
            sp_GetPropertyGenerator.setParameter("PAGE_NUMBER", timeSheetEntity.getPageNumber());
            sp_GetPropertyGenerator.setParameter("PAGE_SIZE", timeSheetEntity.getPageSize());
            sp_GetPropertyGenerator.setParameter("SORTING_KEY", timeSheetEntity.getSortingKey());
            sp_GetPropertyGenerator.setParameter("ORDER_BY", timeSheetEntity.getOrderBy());
            sp_GetPropertyGenerator.setParameter("STRING_TYPE", timeSheetEntity.getStringType());

            sp_GetPropertyGenerator.execute();
            @SuppressWarnings("unchecked")
            List<TimeSheet> results = sp_GetPropertyGenerator.getResultList();
            return results;
        } catch (Exception exception) {
            throw exception;
        }
    }
    public Collection< TimeSheet>addEditApplication(
        Collection< TimeSheet> timeSheet) throws Exception {
        try {

            Gson gson = new GsonBuilder()
                    .registerTypeAdapter(Date.class, new customer.timetracker.utils.SqlDateTypeAdapter()).create();
            String reqPayLoad = gson.toJson(timeSheet);

            StoredProcedureQuery sp_AddEditPropertyGenerator = entityManager
                    .createStoredProcedureQuery("ADD_EDIT_SUPPORT", "TimeSheet_Mapping");
            sp_AddEditPropertyGenerator.registerStoredProcedureParameter("IN_PARAM", String.class, ParameterMode.IN);
            sp_AddEditPropertyGenerator.registerStoredProcedureParameter("EX_MESSAGE", String.class, ParameterMode.OUT);
            sp_AddEditPropertyGenerator.setParameter("IN_PARAM", reqPayLoad);
            sp_AddEditPropertyGenerator.execute();
            String ex_message = (String) sp_AddEditPropertyGenerator.getOutputParameterValue("EX_MESSAGE");
            if (ex_message != null && !ex_message.isBlank()) {
                throw new BusinessException("PO001", ex_message,
                        HttpStatus.BAD_REQUEST);
            }
            List<TimeSheet> results = sp_AddEditPropertyGenerator.getResultList();
            return results;
        } catch (PersistenceException persistenceException) {
            Throwable cause = persistenceException.getCause();
            if (cause instanceof SQLException) {
                SQLException sqlException = (SQLException) cause;
                System.err.println("SQLException: " + sqlException.getMessage());
            } else {
                throw persistenceException; // rethrow the exception if you can't handle it here
            }
        } catch (Exception exception) {
            throw exception;
        }
        return null;
    }
    public TimeSheetDetails getApplicationById(Long id) {
        try {
            StoredProcedureQuery sp_GetObject = entityManager
                    .createStoredProcedureQuery("GET_SUPPORT_BY_ID", "TimeSheetDetails_Mapping");

            sp_GetObject.registerStoredProcedureParameter("ID", Long.class, ParameterMode.IN);
            sp_GetObject.setParameter("ID", id);
            sp_GetObject.execute();

            @SuppressWarnings("unchecked")
            List<TimeSheetDetails> results = sp_GetObject.getResultList();

            if (results.isEmpty()) {
                return null; // Handle the case where no result is found
            }

            return results.get(0); // Return the first result
        } catch (Exception exception) {
            throw exception;
        }
    }
}
