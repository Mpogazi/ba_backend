import pandas as pd
import sqlalchemy
import pymysql
import datetime
import matplotlib.pyplot as plt
import mysql.connector as mysql
import time


# database-related variables
USER = 'ba_dev'
PW = 'dev'
HOST = 'ba-db.clt2cjuppshj.ap-southeast-1.rds.amazonaws.com'
PORT = 3306
DBNAME = 'ba-db'

def query_code_on_date_range(start_date, end_date, code, table_name):
    """Performs a full SELECT for the specified date and database. Can be slow."""
    statement = """
                SELECT * 
                FROM {}
                WHERE (date BETWEEN '{}' AND '{}') AND (code = {})
                """.format(table_name, start_date, end_date, code)

    return execute_sql(statement)

def execute_sql(statement):
    """Executes a general sql query. Should really have a try/catch block."""
    user = USER
    pw = PW
    host = HOST
    port = PORT
    database = DBNAME
    engine = sqlalchemy.create_engine('mysql+pymysql://' +
                                      user + ':' + pw + '@' + host + ':' + str(port) + '/' + database, echo=False)
    out_result = engine.execute(statement)
    out_list = out_result.fetchall()
    out_df = pd.DataFrame(out_list)
    if len(out_df.index) > 0:
        out_df.columns = out_result.keys()

    engine.dispose()
    return out_df

if __name__ == '__main__':

    code = '00607'
    start_date = datetime.date(2019, 8, 1)
    end_date = datetime.datetime.today()
    df = query_code_on_date_range(start_date, end_date, code, 'ccass_holdings_info')
    df = df[['date', 'participant_name', 'holding']]
    df = df.groupby(['date', 'participant_name']).first().unstack(level=-1).fillna(0)
    df = df.droplevel(0, axis=1)

    # df.to_pickle("./temp0607.pkl")
    # df = pd.read_pickle("./temp0607.pkl")
    # df = pd.read_pickle("./temp0968.pkl")


    # df.plot.area()
    df.plot()
    plt.legend('')
    plt.show()




    # # query time testing

    # start_date = datetime.date(2018, 1, 1)
    # end_date = datetime.datetime.today()
    # code = '00700'
    # table_name = 'ccass_holdings_info'
    #
    # query = """
    #         SELECT *
    #         FROM {}
    #         WHERE (date BETWEEN '{}' AND '{}') AND (code = {})
    #         """.format(table_name, start_date, end_date, code)
    #
    #
    #
    #
    # start = time.time()
    # print('testing sqlalchemy, full query on 700.hk')
    #
    # user = USER
    # pw = PW
    # host = HOST
    # port = PORT
    # database = DBNAME
    # engine = sqlalchemy.create_engine('mysql+pymysql://' +
    #                                   user + ':' + pw + '@' + host + ':' + str(port) + '/' + database, echo=False)
    #
    # df = pd.read_sql_query(query, engine)
    # end = time.time()
    # print('final time: {}; number of rows: {}'.format(end - start, len(df.index)))
    #
    #
    #
    # print('testing mysql-connector, full query on 700.hk')
    # start = time.time()
    # db = mysql.connect(
    #     host=HOST,
    #     user=USER,
    #     passwd=PW,
    #     database=DBNAME
    # )
    # cursor = db.cursor()
    # cursor.execute(query)
    # records = cursor.fetchall()
    # end = time.time()
    # print('final time: {}; number of rows: {}'.format(end - start, len(records)))
    #
    #
    #
    #
    # start = time.time()
    # print('testing sqlalchemy, full query on 700.hk')
    # start_date = datetime.date(2019, 8, 1)
    # end_date = datetime.datetime.today()
    # code = '00700'
    # table_name = 'ccass_holdings_info'
    #
    # user = USER
    # pw = PW
    # host = HOST
    # port = PORT
    # database = DBNAME
    # engine = sqlalchemy.create_engine('mysql+pymysql://' +
    #                                   user + ':' + pw + '@' + host + ':' + str(port) + '/' + database, echo=False)
    #
    # df = pd.read_sql_query(query, engine)
    # end = time.time()
    # print('final time: {}; number of rows: {}'.format(end - start, len(df.index)))