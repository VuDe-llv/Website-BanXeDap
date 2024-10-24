PGDMP  %                	    |         	   BicycleDB    16.4    16.4 4    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    25861 	   BicycleDB    DATABASE     �   CREATE DATABASE "BicycleDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "BicycleDB";
                postgres    false            �            1259    25863    auth    TABLE     j  CREATE TABLE public.auth (
    auth_id integer NOT NULL,
    auth_email character varying(255) NOT NULL,
    auth_password character varying(255) NOT NULL,
    auth_role character varying(255) NOT NULL,
    auth_image character varying(255),
    auth_name character varying(255),
    auth_phone character varying(255),
    auth_address character varying(255)
);
    DROP TABLE public.auth;
       public         heap    postgres    false            �            1259    25862    auth_auth_id_seq    SEQUENCE     �   CREATE SEQUENCE public.auth_auth_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.auth_auth_id_seq;
       public          postgres    false    216            �           0    0    auth_auth_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.auth_auth_id_seq OWNED BY public.auth.auth_id;
          public          postgres    false    215            �            1259    25881    brand    TABLE     i   CREATE TABLE public.brand (
    brd_id integer NOT NULL,
    brd_name character varying(255) NOT NULL
);
    DROP TABLE public.brand;
       public         heap    postgres    false            �            1259    25880    brand_brd_id_seq    SEQUENCE     �   CREATE SEQUENCE public.brand_brd_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.brand_brd_id_seq;
       public          postgres    false    220            �           0    0    brand_brd_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.brand_brd_id_seq OWNED BY public.brand.brd_id;
          public          postgres    false    219            �            1259    25907    cart    TABLE     �   CREATE TABLE public.cart (
    cart_id integer NOT NULL,
    auth_id integer,
    prd_id integer,
    quantity integer NOT NULL
);
    DROP TABLE public.cart;
       public         heap    postgres    false            �            1259    25906    cart_cart_id_seq    SEQUENCE     �   CREATE SEQUENCE public.cart_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.cart_cart_id_seq;
       public          postgres    false    224            �           0    0    cart_cart_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.cart_cart_id_seq OWNED BY public.cart.cart_id;
          public          postgres    false    223            �            1259    25874    category    TABLE     l   CREATE TABLE public.category (
    ctg_id integer NOT NULL,
    ctg_name character varying(255) NOT NULL
);
    DROP TABLE public.category;
       public         heap    postgres    false            �            1259    25873    category_ctg_id_seq    SEQUENCE     �   CREATE SEQUENCE public.category_ctg_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.category_ctg_id_seq;
       public          postgres    false    218            �           0    0    category_ctg_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.category_ctg_id_seq OWNED BY public.category.ctg_id;
          public          postgres    false    217            �            1259    25924    orders    TABLE     �  CREATE TABLE public.orders (
    order_id integer NOT NULL,
    auth_id integer,
    prd_id character varying(255) NOT NULL,
    order_quantity character varying(255) NOT NULL,
    order_total_price numeric(38,2) NOT NULL,
    order_date timestamp without time zone NOT NULL,
    order_payment character varying(255) NOT NULL,
    order_shipp character varying(255) NOT NULL,
    order_status character varying(255) NOT NULL
);
    DROP TABLE public.orders;
       public         heap    postgres    false            �            1259    25923    orders_order_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.orders_order_id_seq;
       public          postgres    false    226            �           0    0    orders_order_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;
          public          postgres    false    225            �            1259    25888    product    TABLE     �  CREATE TABLE public.product (
    prd_id integer NOT NULL,
    ctg_id integer,
    brd_id integer,
    prd_name character varying(255) NOT NULL,
    prd_price numeric(38,2) NOT NULL,
    prd_stock integer NOT NULL,
    prd_image character varying(255),
    prd_image1 character varying(255),
    prd_image2 character varying(255),
    prd_image3 character varying(255),
    prd_description character varying(255),
    prd_parameter character varying(255)
);
    DROP TABLE public.product;
       public         heap    postgres    false            �            1259    25887    product_prd_id_seq    SEQUENCE     �   CREATE SEQUENCE public.product_prd_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.product_prd_id_seq;
       public          postgres    false    222            �           0    0    product_prd_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.product_prd_id_seq OWNED BY public.product.prd_id;
          public          postgres    false    221            3           2604    25866    auth auth_id    DEFAULT     l   ALTER TABLE ONLY public.auth ALTER COLUMN auth_id SET DEFAULT nextval('public.auth_auth_id_seq'::regclass);
 ;   ALTER TABLE public.auth ALTER COLUMN auth_id DROP DEFAULT;
       public          postgres    false    215    216    216            5           2604    25884    brand brd_id    DEFAULT     l   ALTER TABLE ONLY public.brand ALTER COLUMN brd_id SET DEFAULT nextval('public.brand_brd_id_seq'::regclass);
 ;   ALTER TABLE public.brand ALTER COLUMN brd_id DROP DEFAULT;
       public          postgres    false    220    219    220            7           2604    25910    cart cart_id    DEFAULT     l   ALTER TABLE ONLY public.cart ALTER COLUMN cart_id SET DEFAULT nextval('public.cart_cart_id_seq'::regclass);
 ;   ALTER TABLE public.cart ALTER COLUMN cart_id DROP DEFAULT;
       public          postgres    false    224    223    224            4           2604    25877    category ctg_id    DEFAULT     r   ALTER TABLE ONLY public.category ALTER COLUMN ctg_id SET DEFAULT nextval('public.category_ctg_id_seq'::regclass);
 >   ALTER TABLE public.category ALTER COLUMN ctg_id DROP DEFAULT;
       public          postgres    false    218    217    218            8           2604    25927    orders order_id    DEFAULT     r   ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);
 >   ALTER TABLE public.orders ALTER COLUMN order_id DROP DEFAULT;
       public          postgres    false    225    226    226            6           2604    25891    product prd_id    DEFAULT     p   ALTER TABLE ONLY public.product ALTER COLUMN prd_id SET DEFAULT nextval('public.product_prd_id_seq'::regclass);
 =   ALTER TABLE public.product ALTER COLUMN prd_id DROP DEFAULT;
       public          postgres    false    221    222    222            �          0    25863    auth 
   TABLE DATA           ~   COPY public.auth (auth_id, auth_email, auth_password, auth_role, auth_image, auth_name, auth_phone, auth_address) FROM stdin;
    public          postgres    false    216   8<       �          0    25881    brand 
   TABLE DATA           1   COPY public.brand (brd_id, brd_name) FROM stdin;
    public          postgres    false    220   o=       �          0    25907    cart 
   TABLE DATA           B   COPY public.cart (cart_id, auth_id, prd_id, quantity) FROM stdin;
    public          postgres    false    224   �=       �          0    25874    category 
   TABLE DATA           4   COPY public.category (ctg_id, ctg_name) FROM stdin;
    public          postgres    false    218   �=       �          0    25924    orders 
   TABLE DATA           �   COPY public.orders (order_id, auth_id, prd_id, order_quantity, order_total_price, order_date, order_payment, order_shipp, order_status) FROM stdin;
    public          postgres    false    226    >       �          0    25888    product 
   TABLE DATA           �   COPY public.product (prd_id, ctg_id, brd_id, prd_name, prd_price, prd_stock, prd_image, prd_image1, prd_image2, prd_image3, prd_description, prd_parameter) FROM stdin;
    public          postgres    false    222   c?       �           0    0    auth_auth_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.auth_auth_id_seq', 4, true);
          public          postgres    false    215            �           0    0    brand_brd_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.brand_brd_id_seq', 4, true);
          public          postgres    false    219            �           0    0    cart_cart_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.cart_cart_id_seq', 6, true);
          public          postgres    false    223            �           0    0    category_ctg_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.category_ctg_id_seq', 3, true);
          public          postgres    false    217            �           0    0    orders_order_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.orders_order_id_seq', 8, true);
          public          postgres    false    225            �           0    0    product_prd_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.product_prd_id_seq', 10, true);
          public          postgres    false    221            :           2606    25872    auth auth_auth_email_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.auth
    ADD CONSTRAINT auth_auth_email_key UNIQUE (auth_email);
 B   ALTER TABLE ONLY public.auth DROP CONSTRAINT auth_auth_email_key;
       public            postgres    false    216            <           2606    25870    auth auth_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.auth
    ADD CONSTRAINT auth_pkey PRIMARY KEY (auth_id);
 8   ALTER TABLE ONLY public.auth DROP CONSTRAINT auth_pkey;
       public            postgres    false    216            @           2606    25886    brand brand_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_pkey PRIMARY KEY (brd_id);
 :   ALTER TABLE ONLY public.brand DROP CONSTRAINT brand_pkey;
       public            postgres    false    220            D           2606    25912    cart cart_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (cart_id);
 8   ALTER TABLE ONLY public.cart DROP CONSTRAINT cart_pkey;
       public            postgres    false    224            >           2606    25879    category category_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (ctg_id);
 @   ALTER TABLE ONLY public.category DROP CONSTRAINT category_pkey;
       public            postgres    false    218            F           2606    25931    orders orders_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            postgres    false    226            B           2606    25895    product product_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (prd_id);
 >   ALTER TABLE ONLY public.product DROP CONSTRAINT product_pkey;
       public            postgres    false    222            I           2606    25913    cart cart_auth_id_fkey 
   FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_auth_id_fkey FOREIGN KEY (auth_id) REFERENCES public.auth(auth_id) ON DELETE CASCADE;
 @   ALTER TABLE ONLY public.cart DROP CONSTRAINT cart_auth_id_fkey;
       public          postgres    false    4668    216    224            J           2606    25918    cart cart_prd_id_fkey 
   FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_prd_id_fkey FOREIGN KEY (prd_id) REFERENCES public.product(prd_id) ON DELETE CASCADE;
 ?   ALTER TABLE ONLY public.cart DROP CONSTRAINT cart_prd_id_fkey;
       public          postgres    false    4674    224    222            K           2606    25932    orders orders_auth_id_fkey 
   FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_auth_id_fkey FOREIGN KEY (auth_id) REFERENCES public.auth(auth_id) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_auth_id_fkey;
       public          postgres    false    4668    216    226            G           2606    25901    product product_brd_id_fkey 
   FK CONSTRAINT     �   ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_brd_id_fkey FOREIGN KEY (brd_id) REFERENCES public.brand(brd_id) ON DELETE SET NULL;
 E   ALTER TABLE ONLY public.product DROP CONSTRAINT product_brd_id_fkey;
       public          postgres    false    220    222    4672            H           2606    25896    product product_ctg_id_fkey 
   FK CONSTRAINT     �   ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_ctg_id_fkey FOREIGN KEY (ctg_id) REFERENCES public.category(ctg_id) ON DELETE SET NULL;
 E   ALTER TABLE ONLY public.product DROP CONSTRAINT product_ctg_id_fkey;
       public          postgres    false    222    218    4670            �   '  x���OJ�0���)r���$�촺�Ō�*.�P���6-JEO .��u#x�i�����a���./����#(��E�Q�Ij�y60����2
��Ҿ-��� �
�]@�7ݼ��q�,,�T��q����#%�����;D8u9�S�SY$ǖ~�׮|��5�3]W��F]�k�U��Yao�/�j$~�륊'xV>��Y� ���Ю*E���ۋ�g}��~s� 1#?2|���'b�n^Lˮ���3�9�~�D)a��I�:ĜD\��撃C�G��7��-���*�6      �   &   x�3�tO��+�2��JM-�2���s��N����� |r�      �   #   x�3�4�4�4�2��@ڌӄ�ЀӔ+F��� 8��      �   8   x�3�HU82�ᮅ@�4��E����D���k�2���$J2�n���\1z\\\ \Z      �   3  x���;N1��{
� %��xf�� TT)iV)p$؀$8 =܀��*Ȋj���g��� "e�X3.>��*�����.@^@��(m�L�G�&���^��e��z9�ӮYU:����:K�zUo�ǧ��ŦH�u~�Ѻ(b@ع�0�������ї�[A�'�G�-�]�8R��&X���K��rv�:G����2�0lpT�蜃����ٛ���սb��D�e
!���-��C��E��y�/�^.XC�v��v�5X�k�̪��|5뚇Z_�v��&�ﺹ횧���+���(> (�k�      �   .  x����n�@���)f٪��3K.iJ"4�"�e�h�P�]�ݴ꺋,+u�u�L���Oұ��3�$��I�7���3��R��|�����������_��@/Z~�� �7�G=Ў±�������d�PJ�--dcaK$0��8b��b��q�9�iF�Q8��2�p�^��,�q1� io"����!������P�7?ݗ�v}�~��Kh� K��T�]*D2�^)rj��kD�Y��/�u�g�y�%nS�s���sr=���I!̱Mߟƣ0x7M��b��B)\�/�j`� ���.�����Ҩ��W;X}�����)Bx�� z�op1�4s���R�n�Z����L���z'�]��Z�|��'g���U?	�ha�^jם�ōi<�y� ��x<t��~�y��X�`aZ�̆E~B���Ɂ=9��1���Ӡ�a����
F墱��	]V��
F�0���N�V���d��-�mwٝ����4����3{��������^
�����t��/�n�tq�a���Q&�p�]���v��ZO_�T�^�U�\���,B+[
�Gԗ1���}��+4��ЋK�2-}�I�L,�kj�:�v��ut����D/���jz$�N�rg��C������p�!c���i���b{3W}�%@fq�>-��m��|؁rɱ���&����x��ϑ[��^.�G�4�j������7�j4SK�{n��G��=�rg��i��?�A�Ң��F�1#o�S�$�߲�@[��4�1d:=�&=Z���7y��O<�N��i�T*�2�4     